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
  updateTodosBulk as apiUpdateBulk
} from "../api/todos";
import { socket } from "../realtime/socket";
import { EV } from "../realtime/events";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "../lib/queryKeys";

export function useTodos() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Filter>(loadFilter());

  const { data, isLoading, isError, error } = useQuery({
    queryKey: qk.todos(filter),
    queryFn: () => listTodos(filter)
  });

  const todos = data ?? [];

  const counts = useMemo(() => {
    const active = todos.filter((t) => !t.completed).length;
    const completed = todos.length - active;
    return { total: todos.length, active, completed };
  }, [todos]);

  const addMut = useMutation({
    mutationFn: (text: string) => apiAdd(text),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.todos(filter) });
    }
  });

  const updateMut = useMutation({
    mutationFn: (args: { id: string; patch: Partial<Pick<Todo, "text" | "completed">> }) =>
      apiUpdate(args.id, args.patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.todos(filter) });
    }
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => apiDelete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.todos(filter) });
    }
  });

  const clearMut = useMutation({
    mutationFn: () => apiClearCompleted(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.todos(filter) });
    }
  });

  const bulkMut = useMutation({
    mutationFn: (args: { patch: Partial<Pick<Todo, "text" | "completed">>; ids?: string[] }) =>
      apiUpdateBulk(args.patch, args.ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.todos(filter) });
    }
  });
  useEffect(() => {
    const inv = () => qc.invalidateQueries({ queryKey: qk.todos(filter) });
    const onCreated = (todo: Todo) => {
      qc.setQueryData<Todo[]>(qk.todos(filter), (prev) => {
        if (!prev) return prev;
        if (
          (filter === "all") ||
          (filter === "active" && !todo.completed) ||
          (filter === "completed" && todo.completed)
        ) {
          return [todo, ...prev];
        }
        return prev;
      });
    };
    const onUpdated = (todo: Todo) => {
      qc.setQueryData<Todo[]>(qk.todos(filter), (prev) =>
        prev ? prev.map((t) => (t.id === todo.id ? todo : t)) : prev
      );
    };
    const onRemoved = ({ id }: { id: string }) => {
      qc.setQueryData<Todo[]>(qk.todos(filter), (prev) =>
        prev ? prev.filter((t) => t.id !== id) : prev
      );
    };

    socket.on(EV.todos.invalidate, inv);
    socket.on(EV.todo.created, onCreated);
    socket.on(EV.todo.updated, onUpdated);
    socket.on(EV.todo.removed, onRemoved);

    return () => {
      socket.off(EV.todos.invalidate, inv);
      socket.off(EV.todo.created, onCreated);
      socket.off(EV.todo.updated, onUpdated);
      socket.off(EV.todo.removed, onRemoved);
    };
  }, [qc, filter]);

  const add = useCallback(async (text: string) => {
    if (!text.trim()) return;
    await addMut.mutateAsync(text.trim());
  }, [addMut]);

  const toggle = useCallback(async (id: string) => {
    const current = todos.find((t) => t.id === id);
    if (!current) return;
    await updateMut.mutateAsync({ id, patch: { completed: !current.completed } });
  }, [todos, updateMut]);

  const edit = useCallback(async (id: string, text: string) => {
    const t = text.trim();
    if (!t) return;
    await updateMut.mutateAsync({ id, patch: { text: t } });
  }, [updateMut]);

  const remove = useCallback(async (id: string) => {
    await deleteMut.mutateAsync(id);
  }, [deleteMut]);

  const clearCompleted = useCallback(async () => {
    await clearMut.mutateAsync();
  }, [clearMut]);

  const changeFilter = useCallback((next: Filter) => {
    setFilter(next);
    persistFilter(next);
  }, []);

  const toggleAll = useCallback(async () => {
    if (todos.length === 0) return;
    const allCompleted = todos.every((t) => t.completed);
    await bulkMut.mutateAsync({ patch: { completed: !allCompleted } });
  }, [todos, bulkMut]);

  const loading =
    isLoading || addMut.isPending || updateMut.isPending || deleteMut.isPending || clearMut.isPending || bulkMut.isPending;

  return {
    todos,
    filter,
    loading,
    error: isError ? (error instanceof Error ? error.message : "Unknown error") : null,
    counts,
    add,
    toggle,
    edit,
    remove,
    clearCompleted,
    changeFilter,
    toggleAll
  };
}
