"use client";

import { useState, useSyncExternalStore } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const STORAGE_KEY = "openclawhk.notes";

const NoteSchema = z.object({
  id: z.string(),
  text: z
    .string()
    .min(1, "內容不能空白")
    .max(100, "內容最多 100 個字元"),
  createdAt: z.string(),
});

const NotesSchema = z.array(NoteSchema);

type Note = z.infer<typeof NoteSchema>;

function readNotes(): Note[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return NotesSchema.parse(JSON.parse(raw));
  } catch {
    return [];
  }
}

// LocalStorage 外部 store（useSyncExternalStore）
let cache: Note[] | null = null;
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

function getSnapshot(): Note[] {
  if (cache === null) cache = readNotes();
  return cache;
}

function getServerSnapshot(): Note[] {
  return [];
}

function writeNotes(notes: Note[]) {
  cache = notes;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // 忽略 quota 等錯誤
  }
  emit();
}

export function LocalNotes() {
  const notes = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const addNote = () => {
    const result = NoteSchema.safeParse({
      id: crypto.randomUUID(),
      text: text.trim(),
      createdAt: new Date().toISOString(),
    });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "驗證失敗");
      return;
    }
    setError(null);
    writeNotes([result.data, ...notes]);
    setText("");
  };

  const removeNote = (id: string) => {
    writeNotes(notes.filter((n) => n.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>本地記事本</CardTitle>
        <CardDescription>
          Zod 驗證 + LocalStorage 持久化（資料只存在你的瀏覽器，不會上傳）
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="note-input">新記事</Label>
          <div className="flex gap-2">
            <Input
              id="note-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addNote();
              }}
              placeholder="輸入一些內容…"
            />
            <Button onClick={addNote} type="button">
              新增
            </Button>
          </div>
          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}
        </div>
        {notes.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            尚無記事，新增一筆試試看吧。
          </p>
        ) : (
          <ul className="space-y-2">
            {notes.map((note) => (
              <li
                key={note.id}
                className="flex items-center justify-between gap-2 rounded-lg border p-3 text-sm"
              >
                <span className="min-w-0 break-words">{note.text}</span>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => removeNote(note.id)}
                >
                  刪除
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
