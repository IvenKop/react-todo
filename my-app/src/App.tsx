import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Filter } from "./types";

import Header from "./components/Header";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import InfoMenu from "./components/InfoMenu";
import Pagination from "./components/Pagination";
import Footer from "./components/Footer";
import SocketDebug from "./components/SocketDebug";
import { Toast, useToast } from "./components/Toast";

import { useTodos } from "./hooks/useTodo";

const FIRST_PAGE = 1;
const PAGE_SIZE = 5;

function readPageFromURL(): number {
  const sp = new URLSearchParams(window.location.search);
  const p = Number(sp.get("page") || String(FIRST_PAGE));
  return Number.isFinite(p) && p >= FIRST_PAGE ? p : FIRST_PAGE;
}

function writePageToURL(nextPage: number) {
  const url = new URL(window.location.href);
  url.searchParams.set("page", String(nextPage));
  window.history.replaceState({}, "", url);
}

export default function App() {
  const {
    todos,
    filter,
    loading,
    error,
    counts,
    add,
    toggle,
    edit,
    remove,
    clearCompleted,
    changeFilter,
    toggleAll,
  } = useTodos();

  const { t } = useTranslation();
  const [page, setPage] = useState<number>(() => readPageFromURL());

  useEffect(() => {
    writePageToURL(page);
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(todos.length / PAGE_SIZE));
  if (page > totalPages) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div role="alert" className="text-center">
          <h1 className="mb-2 text-3xl font-[200] text-[#b83f45]">
            {t("error.404.title")}
          </h1>
          <p className="text-[#5c5c5c]">{t("error.404.message")}</p>
        </div>
      </div>
    );
  }

  const start = (page - 1) * PAGE_SIZE;
  const pagedTodos = useMemo(
    () => todos.slice(start, start + PAGE_SIZE),
    [todos, start],
  );

  const isListEmpty = todos.length > 0;
  const isAllSelected = isListEmpty && todos.every((t) => t.completed);

  function normalize(text: string): string {
    return text.trim().replace(/\s+/g, " ");
  }

  const handleAdd = useCallback(
    async (text: string) => {
      const n = normalize(text);
      if (!n) return;
      const already = todos.some((t) => normalize(t.text) === n);
      if (already) return;
      await add(n);
      setPage(FIRST_PAGE);
      writePageToURL(FIRST_PAGE);
    },
    [add, todos],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await remove(id);
    },
    [remove],
  );

  const handleEdit = useCallback(
    async (id: string, text: string) => {
      const cleaned = text.trim();
      if (!cleaned) return;
      const n = normalize(cleaned);
      const duplicate = todos.some(
        (t) => t.id !== id && normalize(t.text) === n,
      );
      if (duplicate) return;
      await edit(id, cleaned);
    },
    [edit, todos],
  );

  const toast = useToast();

  const handleToggle = useCallback(
    async (id: string) => {
      await toggle(id);
    },
    [toggle],
  );

  const handleToggleAll = useCallback(async () => {
    await toggleAll();
  }, [toggleAll]);

  const handleClearCompleted = useCallback(async () => {
    await clearCompleted();
  }, [clearCompleted]);

  const handlePageChange = useCallback((next: number) => {
    setPage(next);
    writePageToURL(next);
  }, []);

  const setFilter = useCallback(
    (f: Filter) => {
      changeFilter(f);
      setPage(FIRST_PAGE);
      writePageToURL(FIRST_PAGE);
    },
    [changeFilter],
  );

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <div className="relative mx-auto w-[90%] max-w-[550px]">
          <div className="relative z-0 bg-[rgb(246,246,246)] shadow-[0_2px_4px_rgba(0,0,0,0.1),0_25px_50px_rgba(0,0,0,0.1)]">
            <TaskInput
              onAdd={handleAdd}
              isListEmpty={isListEmpty}
              isAllSelected={isAllSelected}
              onToggleAll={handleToggleAll}
            />

            {loading && (
              <div className="p-3 text-sm text-gray-500" aria-live="polite">
                Loading…
              </div>
            )}
            {error && (
              <div className="p-3 text-sm text-red-600" role="alert">
                {error}
              </div>
            )}

            <TaskList
              todos={pagedTodos}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onToggle={handleToggle}
            />

            {todos.length > 0 && (
              <InfoMenu
                activeCount={counts.active}
                filter={filter}
                setFilter={setFilter}
                onClearCompleted={handleClearCompleted}
              />
            )}
          </div>
        </div>

        <Pagination
          total={todos.length}
          pageSize={PAGE_SIZE}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      </main>
      <Footer />
      <Toast message={toast.message} />
      <SocketDebug />
    </div>
  );
}
