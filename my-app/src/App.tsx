import { useCallback, useEffect, useState } from "react";
import type { Todo } from "./types";
import { getTodos, saveTodos } from "./utils/storage";
import { genId } from "./utils/id";

import Header from "./components/Header";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import Footer from "./components/Footer";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => getTodos());

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
            todos={todos}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onToggle={handleToggle}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
