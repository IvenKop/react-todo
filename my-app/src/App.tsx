import { useCallback, useEffect, useState } from "react";
import type { Todo } from "./types";
import { getTodos, saveTodos } from "./utils/storage";
import { genId } from "./utils/id";

import Header from "./components/Header";
import InputBox from "./components/InputBox";
import TaskList from "./components/TaskList";
import Footer from "./components/Footer";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => getTodos());

  useEffect(() => { saveTodos(todos); }, [todos]);

  const handleAdd = useCallback((text: string) => {
    setTodos(prev => [...prev, { id: genId(), text, completed: false }]);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleEdit = useCallback((id: string, text: string) => {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, text } : t)));
  }, []);

  const handleToggle = useCallback((id: string) => {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <div className="w-[90%] max-w-[550px] mx-auto bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1),0_25px_50px_rgba(0,0,0,0.1)]">
          <InputBox onAdd={handleAdd} />
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
