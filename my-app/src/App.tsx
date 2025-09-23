import { useEffect, useState } from 'react';
import './App.css';

import type { Todo, Filter } from './types';
import { getTodos, setTodos, getFilter, setFilter } from './utils/storage';
import { genId } from './utils/id';

import Header from './components/Header';
import InputBox from './components/InputBox';

export default function App() {
  const [todos, setTodosState] = useState<Todo[]>(() => getTodos());
  const [filter, setFilterState] = useState<Filter>(() => getFilter());

  useEffect(() => {
    setTodos(todos);
  }, [todos]);

  useEffect(() => {
    setFilter(filter);
  }, [filter]);

  const handleAdd = (text: string) => {
    setTodosState((prev) => [
      ...prev,
      { id: genId(), text, completed: false },
    ]);
  };

  return (
    <div className="body-page">
      <Header />

      <main className="main-page">
          <InputBox onAdd={handleAdd} />

          {todos.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#6b6b6b', marginTop: 16 }}>
              No tasks
            </p>
          ) : (
            <p style={{ textAlign: 'center', color: '#6b6b6b', marginTop: 16 }}>
              Tasks total: {todos.length}
            </p>
          )}
      </main>

      <footer className="footer-page">
        <p className="footer-page_advice">Double-click to edit</p>
        <p className="footer-page__team-name">Created by the Devico Solution</p>
        <p className="footer-page__part">
          part of <span className="footer-page__span">Devico</span>
        </p>
      </footer>
    </div>
  );
}
