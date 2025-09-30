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

  const handleAdd = useCallback((text: string) => {
    setTodos((prev) => [...prev, { id: genId(), text, completed: false }]);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleEdit = useCallback((id: string, text: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
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
        <div className="mx-auto w-[90%] max-w-[550px] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1),0_25px_50px_rgba(0,0,0,0.1)]">
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
      </main>
      <Footer />
    </div>
  );
}
