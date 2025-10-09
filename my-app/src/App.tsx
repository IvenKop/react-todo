import { useCallback, useEffect, useMemo, useState } from "react";
import type { Todo, Filter } from "./types";
import { getTodos, saveTodos, getFilter, saveFilter } from "./utils/storage";
import { genId } from "./utils/id";
import { useTranslation } from "react-i18next";

import InfoMenu from "./components/InfoMenu";
import Header from "./components/Header";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import Footer from "./components/Footer";
import Pagination from "./components/Pagination";

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
  const [todos, setTodos] = useState<Todo[]>(() => getTodos());
  const [activeFilter, setActiveFilter] = useState<Filter>(() => getFilter());
  const [page, setPage] = useState<number>(() => readPageFromURL());
  const { t } = useTranslation();

  const setFilter = (newFilter: Filter) => {
    setActiveFilter(newFilter);
    saveFilter(newFilter);
    setPage(FIRST_PAGE);
    writePageToURL(FIRST_PAGE);
  };

  useEffect(() => {
    writePageToURL(page);
  }, [page]);

  const visibleTodos = useMemo(() => {
    if (!activeFilter || activeFilter === "all") return todos;
    return todos.filter((t) =>
      activeFilter === "active" ? !t.completed : t.completed,
    );
  }, [todos, activeFilter]);

  const totalPages = Math.max(1, Math.ceil(visibleTodos.length / PAGE_SIZE));

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
  const pagedTodos = visibleTodos.slice(start, start + PAGE_SIZE);

  const activeCount = useMemo(() => {
    return activeFilter === "active"
      ? visibleTodos.length
      : todos.filter((t) => !t.completed).length;
  }, [activeFilter, visibleTodos, todos]);

  const handleClearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, []);

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  function normalize(text: string): string {
    return text.trim().replace(/\s+/g, " ");
  }

  const handleAdd = useCallback((text: string) => {
    const n = normalize(text);
    if (!n) return;
    setTodos((prev) => {
      if (prev.some((t) => normalize(t.text) === n)) return prev;
      return [...prev, { id: genId(), text: n, completed: false }];
    });
  }, []);

  const handleDelete = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleEdit = useCallback((id: string, text: string) => {
    const cleaned = text.trim();
    if (!cleaned) return;
    setTodos((prev) => {
      const n = normalize(cleaned);
      if (prev.some((t) => t.id !== id && normalize(t.text) === n)) return prev;
      return prev.map((t) => (t.id === id ? { ...t, text: cleaned } : t));
    });
  }, []);

  const handleToggle = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  }, []);

  const isListEmpty = todos.length > 0;
  const isAllSelected = isListEmpty && todos.every((t) => t.completed);

  const handleToggleAll = useCallback(() => {
    setTodos((prev) => {
      const allDone = prev.length > 0 && prev.every((t) => t.completed);
      const makeCompleted = !allDone;
      return prev.map((t) => ({ ...t, completed: makeCompleted }));
    });
  }, []);

  const handlePageChange = useCallback((next: number) => {
    setPage(next);
    writePageToURL(next);
  }, []);

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
            <TaskList
              todos={pagedTodos}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onToggle={handleToggle}
            />
            {todos.length > 0 && (
              <InfoMenu
                activeCount={activeCount}
                filter={activeFilter}
                setFilter={setFilter}
                onClearCompleted={handleClearCompleted}
              />
            )}
          </div>
        </div>

        <Pagination
          total={visibleTodos.length}
          pageSize={PAGE_SIZE}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      </main>
      <Footer />
    </div>
  );
}
