import { useState } from "react";
import type { Todo } from "./types";
import { getTodos, } from "./utils/storage";
import { genId } from "./utils/id";

import Header from "./components/Header";
import InputBox from "./components/InputBox";
import TaskList from "./components/TaskList";
import Footer from "./components/Footer";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => getTodos());

  const handleAdd = (text: string) => {
    setTodos(prev => [...prev, { id: genId(), text, completed: false }]);
  };
  const handleDelete = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };
  const handleEdit = (id: string, text: string) => {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, text } : t)));
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <div className="w-[90%] max-w-[550px] mx-auto shadow-[0_2px_4px_rgba(0,0,0,0.1),0_25px_50px_rgba(0,0,0,0.1)]">
          <InputBox onAdd={handleAdd} />
          <TaskList todos={todos} onDelete={handleDelete} onEdit={handleEdit} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
