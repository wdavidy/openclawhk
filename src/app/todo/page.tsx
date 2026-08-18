import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TodoList } from "@/components/todo-list";

export const metadata: Metadata = {
  title: "待辦清單",
  description:
    "Todo List — 新增、編輯、刪除、完成標記，資料儲存在瀏覽器 LocalStorage",
};

export default function TodoPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight">待辦清單</h1>
        <p className="mt-2 text-muted-foreground">
          支援新增、編輯、刪除、完成標記與篩選 — 所有資料只儲存在你的瀏覽器。
        </p>
        <div className="mt-8">
          <TodoList />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
