import { useCallback, useEffect, useState } from "react";
import type { Filter } from "./types";
import Header from "./components/Header";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import InfoMenu from "./components/InfoMenu";
import Pagination from "./components/Pagination";
import Footer from "./components/Footer";
import { ToastContainer } from "./components/Toast";
import { useToast } from "./hooks/useToast";
import { useTodos } from "./hooks/useTodo";
import {
  getFilter as loadFilter,
  saveFilter as persistFilter,
} from "./api/todos";

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
  const toast = useToast();

  const [filter, setFilter] = useState<Filter>(() => loadFilter());
  const [page, setPage] = useState<number>(() => readPageFromURL());

  useEffect(() => {
    writePageToURL(page);
  }, [page]);

  const {
    todos,
    total,
    error,
    counts,
    add,
    toggle,
    edit,
    remove,
    clearCompleted,
    toggleAll,
  } = useTodos({ toast, filter, page, pageSize: PAGE_SIZE });

  const hasAnyTasks = counts.total > 0;
  const isAllSelected = hasAnyTasks && counts.active === 0;

  const handleAdd = useCallback(
    async (text: string) => {
      const cleaned = text.trim().replace(/\s+/g, " ");
      if (!cleaned) return;
      await add(cleaned);
      setPage(FIRST_PAGE);
      writePageToURL(FIRST_PAGE);
    },
    [add],
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
      await edit(id, cleaned);
    },
    [edit],
  );

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

  const handleSetFilter = useCallback((f: Filter) => {
    setFilter(f);
    persistFilter(f);
    setPage(FIRST_PAGE);
    writePageToURL(FIRST_PAGE);
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <div className="relative mx-auto w-[90%] max-w-[550px]">
          <div className="relative z-0 bg-[rgb(246,246,246)] shadow-[0_2px_4px_rgba(0,0,0,0.1),0_25px_50px_rgba(0,0,0,0.1)]">
            <TaskInput
              onAdd={handleAdd}
              isListEmpty={hasAnyTasks}
              isAllSelected={isAllSelected}
              onToggleAll={handleToggleAll}
            />
            {error && (
              <div className="p-3 text-sm text-red-600" role="alert">
                {error}
              </div>
            )}
            <TaskList
              todos={todos}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onToggle={handleToggle}
            />
            {hasAnyTasks && (
              <InfoMenu
                activeCount={counts.active}
                filter={filter}
                setFilter={handleSetFilter}
                onClearCompleted={handleClearCompleted}
              />
            )}
          </div>
        </div>
        <Pagination
          total={total}
          pageSize={PAGE_SIZE}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      </main>
      <Footer />
      <ToastContainer messages={toast.messages} />
    </div>
  );
}
