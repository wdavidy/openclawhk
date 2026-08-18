"use client";

import { useState, useSyncExternalStore } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const STORAGE_KEY = "***";

const TodoSchema = z.object({
  id: z.string(),
  text: z.string(),
  completed: z.boolean(),
  createdAt: z.string(),
});

const TodosSchema = z.array(TodoSchema);

type Todo = z.infer<typeof TodoSchema>;
type Filter = "all" | "active" | "completed";

function readTodos(): Todo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return TodosSchema.parse(JSON.parse(raw));
  } catch {
    return [];
  }
}

// LocalStorage 外部 store（useSyncExternalStore）
let cache: Todo[] | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function onStorage(event: StorageEvent) {
  if (event.key === STORAGE_KEY) {
    cache = null;
    emit();
  }
}

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): Todo[] {
  if (cache === null) cache = readTodos();
  return cache;
}

function getServerSnapshot(): Todo[] {
  return [];
}

function writeTodos(todos: Todo[]) {
  cache = todos;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // 忽略 quota 等錯誤
  }
  emit();
}

function validateText(text: string) {
  const result = z
    .string()
    .trim()
    .min(1, "內容不能空白")
    .max(200, "內容最多 200 個字元")
    .safeParse(text);
  return result.success
    ? { ok: true as const, value: result.data }
    : {
        ok: false as const,
        message: result.error.issues[0]?.message ?? "驗證失敗",
      };
}

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "active", label: "進行中" },
  { value: "completed", label: "已完成" },
];

export function TodoList() {
  const todos = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  const addTodo = () => {
    const result = validateText(text);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setError(null);
    writeTodos([
      ...todos,
      {
        id: crypto.randomUUID(),
        text: result.value,
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ]);
    setText("");
  };

  const toggleTodo = (id: string) => {
    writeTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTodo = (id: string) => {
    writeTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
    setEditError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
    setEditError(null);
  };

  const saveEdit = (id: string) => {
    const result = validateText(editText);
    if (!result.ok) {
      setEditError(result.message);
      return;
    }
    writeTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: result.value } : todo,
      ),
    );
    cancelEdit();
  };

  const clearCompleted = () => {
    writeTodos(todos.filter((todo) => !todo.completed));
  };

  const visibleTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  let emptyMessage: string;
  if (todos.length === 0) {
    emptyMessage = "尚無待辦事項，新增一筆吧！";
  } else if (filter === "active") {
    emptyMessage = "沒有進行中的事項 🎉";
  } else {
    emptyMessage = "沒有已完成的事項";
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>待辦清單</CardTitle>
        <CardDescription>
          新增、編輯、刪除、完成標記 — 資料儲存在瀏覽器 LocalStorage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addTodo();
              }}
              placeholder="新增待辦事項…"
              aria-label="新增待辦事項"
            />
            <Button onClick={addTodo} type="button">
              新增
            </Button>
          </div>
          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}
        </div>

        <div
          className="inline-flex rounded-lg bg-muted p-1"
          role="tablist"
          aria-label="篩選待辦事項"
        >
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={filter === value}
              onClick={() => setFilter(value)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {visibleTodos.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </p>
        ) : (
          <ul className="space-y-2">
            {visibleTodos.map((todo) => (
              <li
                key={todo.id}
                className="group flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <button
                  type="button"
                  onClick={() => toggleTodo(todo.id)}
                  aria-label={
                    todo.completed ? "標記為未完成" : "標記為完成"
                  }
                  aria-pressed={todo.completed}
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    todo.completed
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input hover:border-primary"
                  }`}
                >
                  {todo.completed ? (
                    <svg
                      viewBox="0 0 16 16"
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 8.5l3 3 7-7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </button>

                {editingId === todo.id ? (
                  <div className="flex flex-1 items-center gap-2">
                    <Input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(todo.id);
                        if (e.key === "Escape") cancelEdit();
                      }}
                      autoFocus
                      aria-label="編輯待辦事項"
                      className="h-8"
                    />
                    <Button
                      size="sm"
                      type="button"
                      onClick={() => saveEdit(todo.id)}
                    >
                      儲存
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      type="button"
                      onClick={cancelEdit}
                    >
                      取消
                    </Button>
                  </div>
                ) : (
                  <>
                    <span
                      className={`min-w-0 flex-1 break-words text-sm ${
                        todo.completed
                          ? "text-muted-foreground line-through"
                          : ""
                      }`}
                    >
                      {todo.text}
                    </span>
                    <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={() => startEdit(todo)}
                      >
                        編輯
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={() => deleteTodo(todo.id)}
                      >
                        刪除
                      </Button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}

        {editError ? (
          <p className="text-sm text-destructive">{editError}</p>
        ) : null}
      </CardContent>
      <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {activeCount} 項待完成
          {completedCount > 0 ? `，${completedCount} 項已完成` : ""}
        </span>
        {completedCount > 0 ? (
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={clearCompleted}
          >
            清除已完成
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}
