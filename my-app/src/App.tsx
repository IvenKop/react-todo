import { useCallback, useEffect, useMemo, useState } from "react";
import type { Todo, Filter } from "./types";
import { getTodos, saveTodos, getFilter, saveFilter } from "./utils/storage";
import { genId } from "./utils/id";

import InfoMenu from "./components/InfoMenu";
import Header from "./components/Header";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import Footer from "./components/Footer";
import Pagination from "./components/Pagination";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => getTodos());
  const [activeFilter, setActiveFilter] = useState<Filter>(() => getFilter());

  const [page, setPage] = useState(1);
  const pageSize = 5;

  const setFilter = (action: Filter | ((p: Filter) => Filter)) => {
    setActiveFilter((prev) => {
      const next =
        typeof action === "function"
          ? (action as (p: Filter) => Filter)(prev)
          : action;
      saveFilter(next);
      return next;
    });
  };

  const visibleTodos = useMemo(() => {
    if (!activeFilter || activeFilter === "all") return todos;
    return todos.filter((t) =>
      activeFilter === "active" ? !t.completed : t.completed,
    );
  }, [todos, activeFilter]);

  useEffect(() => {
    setPage(1);
  }, [activeFilter]);

  const totalPages = Math.max(1, Math.ceil(visibleTodos.length / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const start = (page - 1) * pageSize;
  const pagedTodos = visibleTodos.slice(start, start + pageSize);

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

        {visibleTodos.length > 0 && (
          <Pagination
            total={visibleTodos.length}
            pageSize={pageSize}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
