import { useCallback, useEffect, useMemo, useState } from "react";
import type { Todo, Filter } from "./types";
import { getTodos, saveTodos, getFilter, saveFilter } from "./utils/storage";
import { genId } from "./utils/id";

import InfoMenu from "./components/InfoMenu";
import Header from "./components/Header";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import Footer from "./components/Footer";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => getTodos());

  const [activeFilter, setActiveFilter] = useState<Filter>(() => getFilter());

  const setFilter = useCallback<React.Dispatch<React.SetStateAction<Filter>>>(
    (action) => {
      setActiveFilter((prev) => {
        const next =
          typeof action === "function"
            ? (action as (p: Filter) => Filter)(prev)
            : action;
        saveFilter(next);
        return next;
      });
    },
    [],
  );

  const visibleTodos = useMemo(() => {
    if (!activeFilter || activeFilter === "all") {
      return todos;
    }
    return todos.filter((t) =>
      activeFilter === "active" ? !t.completed : t.completed,
    );
  }, [todos, activeFilter]);

  const activeCount = useMemo(() => {
    return activeFilter === "active"
      ? visibleTodos.length
      : todos.filter((t) => !t.completed).length;
  }, [activeFilter, visibleTodos.length, todos]);

  const handleClearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, []);

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const normalize = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase();

  const handleAdd = useCallback((text: string) => {
    const cleaned = text.trim();
    if (!cleaned) return;
    setTodos((prev) => {
      const n = normalize(cleaned);
      if (prev.some((t) => normalize(t.text) === n)) return prev;
      return [...prev, { id: genId(), text: cleaned, completed: false }];
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
          {todos.length > 0 && (
            <>
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-[12px] left-[20px] right-[20px] z-[1] h-[6px] rounded-none bg-[rgb(246,246,246)] shadow-[0_1px_1px_rgba(0,0,0,0.2),0_8px_0_-3px_#f6f6f6,0_9px_1px_-3px_rgba(0,0,0,0.2),0_16px_0_-6px_#f6f6f6,0_17px_2px_-6px_rgba(0,0,0,0.2)]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-[6px] left-[10px] right-[10px] z-[1] h-[6px] rounded-none bg-[rgb(246,246,246)] shadow-[0_1px_1px_rgba(0,0,0,0.2),0_8px_0_-3px_#f6f6f6,0_9px_1px_-3px_rgba(0,0,0,0.2),0_16px_0_-6px_#f6f6f6,0_17px_2px_-6px_rgba(0,0,0,0.2)]"
              />
            </>
          )}

          <div className="relative z-0 bg-[rgb(246,246,246)] shadow-[0_2px_4px_rgba(0,0,0,0.1),0_25px_50px_rgba(0,0,0,0.1)]">
            <TaskInput
              onAdd={handleAdd}
              isListEmpty={isListEmpty}
              isAllSelected={isAllSelected}
              onToggleAll={handleToggleAll}
            />
            <TaskList
              todos={visibleTodos}
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
      </main>
      <Footer />
    </div>
  );
}
