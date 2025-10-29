import { useEffect, useMemo, useState, useCallback } from "react";
import type { Todo, Filter } from "../types";
import {
  listTodos,
  addTodo as apiAdd,
  updateTodo as apiUpdate,
  deleteTodo as apiDelete,
  clearCompleted as apiClearCompleted,
  getFilter as loadFilter,
  saveFilter as persistFilter,
  updateTodosBulk as apiUpdateBulk,
} from "../api/todos";
import { socket } from "../realtime/socket";
import { EV } from "../realtime/events";

interface ToastContext {
  show: (msg: string, type?: "success" | "error" | "info") => void;
}

export function useTodos(toast?: ToastContext) {
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(() => loadFilter());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [allItems, filteredItems] = await Promise.all([
        listTodos("all"),
        filter === "all" ? Promise.resolve<Todo[]>([]) : listTodos(filter),
      ]);
      setAllTodos(allItems);
      setTodos(filter === "all" ? allItems : filteredItems);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load todos");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const matchesFilter = useCallback((t: Todo, f: Filter) => {
    if (f === "all") return true;
    if (f === "active") return !t.completed;
    if (f === "completed") return t.completed;
    return true;
  }, []);

  useEffect(() => {
    const onCreated = (incoming: Todo) => {
      setAllTodos((prev) => (prev.some((x) => x.id === incoming.id) ? prev : [incoming, ...prev]));
      if (matchesFilter(incoming, filter)) {
        setTodos((prev) => (prev.some((x) => x.id === incoming.id) ? prev : [incoming, ...prev]));
      }
    };

    const onUpdated = (incoming: Todo) => {
      setAllTodos((prev) => {
        const idx = prev.findIndex((x) => x.id === incoming.id);
        if (idx === -1) return [incoming, ...prev];
        const copy = prev.slice();
        copy[idx] = { ...copy[idx], ...incoming };
        return copy;
      });

      setTodos((prev) => {
        const idx = prev.findIndex((x) => x.id === incoming.id);
        const fits = matchesFilter(incoming, filter);
        if (!fits) {
          if (idx === -1) return prev;
          const copy = prev.slice();
          copy.splice(idx, 1);
          return copy;
        }
        if (idx === -1) return [incoming, ...prev];
        const copy = prev.slice();
        copy[idx] = { ...copy[idx], ...incoming };
        return copy;
      });
    };

    const onRemoved = ({ id }: { id: string }) => {
      setAllTodos((prev) => prev.filter((t) => t.id !== id));
      setTodos((prev) => prev.filter((t) => t.id !== id));
    };

    const handleInvalidate = () => {
      void fetchList();
    };

    socket.on(EV.todos.invalidate, handleInvalidate);
    socket.on(EV.todo.created, onCreated);
    socket.on(EV.todo.updated, onUpdated);
    socket.on(EV.todo.removed, onRemoved);

    return () => {
      socket.off(EV.todos.invalidate, handleInvalidate);
      socket.off(EV.todo.created, onCreated);
      socket.off(EV.todo.updated, onUpdated);
      socket.off(EV.todo.removed, onRemoved);
    };
  }, [fetchList, matchesFilter, filter]);

  async function add(text: string) {
    const created = await apiAdd(text);
    if (!socket.connected) {
      setAllTodos((prev) => (prev.some((t) => t.id === created.id) ? prev : [created, ...prev]));
      if (matchesFilter(created, filter)) {
        setTodos((prev) => (prev.some((t) => t.id === created.id) ? prev : [created, ...prev]));
      }
    }
    toast?.show("Task added", "success");
  }

  async function toggle(id: string) {
    const prevAll = allTodos.find((t) => t.id === id);
    if (!prevAll) return;
    const next = { completed: !prevAll.completed };

    setAllTodos((xs) => xs.map((t) => (t.id === id ? { ...t, ...next } : t)));
    setTodos((xs) => xs.filter((t) => (matchesFilter({ ...t, ...next }, filter) ? true : t.id !== id)).map((t) => (t.id === id ? { ...t, ...next } : t)));
    try {
      await apiUpdate(id, next);
    } catch {
      setAllTodos((xs) => xs.map((t) => (t.id === id ? prevAll : t)));
      setTodos((xs) => {
        const was = prevAll;
        const fits = matchesFilter(was, filter);
        const fixed = xs.map((t) => (t.id === id ? was : t));
        return fits ? fixed : fixed.filter((t) => t.id !== id);
      });
    }
  }

  async function edit(id: string, text: string) {
    const prev = allTodos.find((t) => t.id === id);
    if (!prev) return;
    setAllTodos((xs) => xs.map((t) => (t.id === id ? { ...t, text } : t)));
    setTodos((xs) => xs.map((t) => (t.id === id ? { ...t, text } : t)));
    try {
      await apiUpdate(id, { text });
      toast?.show("Task updated", "info");
    } catch {
      setAllTodos((xs) => xs.map((t) => (t.id === id ? prev : t)));
      setTodos((xs) => xs.map((t) => (t.id === id ? prev : t)));
    }
  }

  async function remove(id: string) {
    const prevAll = allTodos;
    const prevFiltered = todos;
    setAllTodos((xs) => xs.filter((t) => t.id !== id));
    setTodos((xs) => xs.filter((t) => t.id !== id));
    try {
      await apiDelete(id);
      toast?.show("Task deleted", "success");
    } catch {
      setAllTodos(prevAll);
      setTodos(prevFiltered);
    }
  }

  async function clearCompleted() {
    const prevAll = allTodos;
    const prevFiltered = todos;
    setAllTodos((xs) => xs.filter((t) => !t.completed));
    setTodos((xs) => xs.filter((t) => !t.completed));
    try {
      await apiClearCompleted();
    } catch {
      setAllTodos(prevAll);
      setTodos(prevFiltered);
    }
  }

  function changeFilter(next: Filter) {
    persistFilter(next);
    setFilter(next);
  }

  async function toggleAll() {
    const allDone = allTodos.length > 0 && allTodos.every((t) => t.completed);
    const makeCompleted = !allDone;
    const snapAll = allTodos;
    const snapFiltered = todos;

    setAllTodos((xs) => xs.map((t) => ({ ...t, completed: makeCompleted })));
    setTodos((xs) =>
      xs
        .map((t) => ({ ...t, completed: makeCompleted }))
        .filter((t) => matchesFilter(t, filter)),
    );

    try {
      await apiUpdateBulk({ completed: makeCompleted });
    } catch {
      setAllTodos(snapAll);
      setTodos(snapFiltered);
      await fetchList();
    }
  }

  const counts = useMemo(() => {
    const active = allTodos.filter((t) => !t.completed).length;
    const completed = allTodos.length - active;
    return { active, completed, total: allTodos.length };
  }, [allTodos]);

  return {
    todos,
    filter,
    loading,
    error,
    counts,
    add,
    toggle,
    edit,
    remove,
    clearCompleted,
    changeFilter,
    toggleAll,
  };
}
