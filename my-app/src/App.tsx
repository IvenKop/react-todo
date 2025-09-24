import { useEffect, useState } from "react";

import type { Todo} from "./types";
import { getTodos} from "./utils/storage";
import { genId } from "./utils/id";

import Header from "./components/Header";
import InputBox from "./components/InputBox";
import Footer from "./components/Footer";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => getTodos());

  const handleAdd = (text: string) => {
    setTodos((prev) => [...prev, { id: genId(), text, completed: false }]);
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <div className="w-[90%] max-w-[550px] mx-auto mt-2 bg-transparent shadow-[0_2px_4px_rgba(0,0,0,0.1),0_25px_50px_rgba(0,0,0,0.1)] pb-3">
          <InputBox onAdd={handleAdd} />

          <p className="text-center text-[#6b6b6b] mt-4">
            {todos.length === 0
              ? "No tasks yet — add your first one 👆"
              : `Tasks total: ${todos.length}`}
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
