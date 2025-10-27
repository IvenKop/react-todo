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
} from "../api/todos";
import { socket } from "../realtime/socket";

interface ToastContext {
  show: (msg: string, type?: "success" | "error" | "info") => void;
}

export function useTodos(toast?: ToastContext) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(() => loadFilter());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await listTodos(filter);
      setTodos(items);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load todos");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const items = await listTodos(filter);
        if (!cancelled) setTodos(items);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load todos");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [filter]);

  const matchesFilter = useCallback(
    (t: Todo, f: Filter) => {
      if (f === "all") return true;
      if (f === "active") return !t.completed;
      if (f === "completed") return t.completed;
      return true;
    },
    []
  );

  useEffect(() => {
    const onInvalidate = () => fetchList();
    const onUpsert = (incoming: Todo) => {
      setTodos((prev) => {
        const fits = matchesFilter(incoming, filter);
        const idx = prev.findIndex((x) => x.id === incoming.id);

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
    const onRemoved = ({ id }: { id: string }) =>
      setTodos((prev) => prev.filter((t) => t.id !== id));

    socket.on("todos:invalidate", onInvalidate);
    socket.on("todo:upsert", onUpsert);
    socket.on("todo:removed", onRemoved);

    return () => {
      socket.off("todos:invalidate", onInvalidate);
      socket.off("todo:upsert", onUpsert);
      socket.off("todo:removed", onRemoved);
    };
  }, [fetchList, matchesFilter, filter]);

  async function add(text: string) {
    const created = await apiAdd(text);
    setTodos((prev) => [created, ...prev]);
    toast?.show("Task added", "success");
  }

  async function toggle(id: string) {
    const prev = todos.find((t) => t.id === id);
    if (!prev) return;
    const next = { completed: !prev.completed };
    setTodos((xs) => xs.map((t) => (t.id === id ? { ...t, ...next } : t)));
    try {
      await apiUpdate(id, next);
    } catch {
      setTodos((xs) => xs.map((t) => (t.id === id ? prev : t)));
    }
  }

  async function edit(id: string, text: string) {
    const prev = todos.find((t) => t.id === id);
    if (!prev) return;
    setTodos((xs) => xs.map((t) => (t.id === id ? { ...t, text } : t)));
    try {
      await apiUpdate(id, { text });
      toast?.show("Task updated", "info");
    } catch {
      setTodos((xs) => xs.map((t) => (t.id === id ? prev : t)));
    }
  }

  async function remove(id: string) {
    const prev = todos;
    setTodos((xs) => xs.filter((t) => t.id !== id));
    try {
      await apiDelete(id);
      toast?.show("Task deleted", "success");
    } catch {
      setTodos(prev);
    }
  }

  async function clearCompleted() {
    const prev = todos;
    setTodos((xs) => xs.filter((t) => !t.completed));
    try {
      await apiClearCompleted();
    } catch {
      setTodos(prev);
    }
  }

  function changeFilter(next: Filter) {
    persistFilter(next);
    setFilter(next);
  }

  async function toggleAll() {
    const allDone = todos.length > 0 && todos.every((t) => t.completed);
    const makeCompleted = !allDone;
    setTodos((xs) => xs.map((t) => ({ ...t, completed: makeCompleted })));

    try {
      await Promise.all(
        todos.map((t) => apiUpdate(t.id, { completed: makeCompleted }))
      );
    } catch {
      const fresh = await listTodos(filter);
      setTodos(fresh);
    }
  }

  const counts = useMemo(() => {
    const active = todos.filter((t) => !t.completed).length;
    const completed = todos.length - active;
    return { active, completed, total: todos.length };
  }, [todos]);

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
