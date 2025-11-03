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

type ToastApi = { show: (text: string, type?: "success" | "error" | "info") => void };

export function useTodos(opts?: { toast?: ToastApi }) {
  const toast = opts?.toast;
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Filter>(loadFilter());

  const { data: all = [], isLoading, isError, error } = useQuery({
    queryKey: qk.todos("all"),
    queryFn: () => listTodos("all")
  });

  const todos = useMemo(() => {
    if (filter === "all") return all;
    if (filter === "active") return all.filter((t) => !t.completed);
    return all.filter((t) => t.completed);
  }, [all, filter]);

  const counts = useMemo(() => {
    const total = all.length;
    const active = all.filter((t) => !t.completed).length;
    const completed = total - active;
    return { total, active, completed };
  }, [all]);

  const err = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong");
  const invalidateAll = () => qc.invalidateQueries({ queryKey: qk.todos("all") });

  const addMut = useMutation({
    mutationFn: (text: string) => apiAdd(text),
    onSuccess: () => {
      invalidateAll();
      toast?.show("Task added", "success");
    },
    onError: (e) => toast?.show(err(e), "error")
  });

  const updateMut = useMutation({
    mutationFn: (args: { id: string; patch: Partial<Pick<Todo, "text" | "completed">> }) =>
      apiUpdate(args.id, args.patch),
    onSuccess: () => {
      invalidateAll();
      toast?.show("Task updated", "success");
    },
    onError: (e) => toast?.show(err(e), "error")
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => apiDelete(id),
    onSuccess: () => {
      invalidateAll();
      toast?.show("Task deleted", "info");
    },
    onError: (e) => toast?.show(err(e), "error")
  });

  const clearMut = useMutation({
    mutationFn: () => apiClearCompleted(),
    onSuccess: () => {
      invalidateAll();
      toast?.show("Completed cleared", "info");
    },
    onError: (e) => toast?.show(err(e), "error")
  });

  const bulkMut = useMutation({
    mutationFn: (args: { patch: Partial<Pick<Todo, "text" | "completed">>; ids?: string[] }) =>
      apiUpdateBulk(args.patch, args.ids),
    onSuccess: () => {
      invalidateAll();
      toast?.show("Tasks updated", "success");
    },
    onError: (e) => toast?.show(err(e), "error")
  });

  useEffect(() => {
    const inv = () => invalidateAll();
    const onCreated = (todo: Todo) => {
      qc.setQueryData<Todo[]>(qk.todos("all"), (prev) => {
        if (!prev) return [todo];
        if (prev.some((t) => t.id === todo.id)) return prev;
        return [todo, ...prev];
      });
    };
    const onUpdated = (todo: Todo) => {
      qc.setQueryData<Todo[]>(qk.todos("all"), (prev) =>
        prev ? prev.map((t) => (t.id === todo.id ? todo : t)) : prev
      );
    };
    const onRemoved = ({ id }: { id: string }) => {
      qc.setQueryData<Todo[]>(qk.todos("all"), (prev) =>
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
  }, [qc]);

  const add = useCallback(async (text: string) => {
    if (!text.trim()) return;
    await addMut.mutateAsync(text.trim());
  }, [addMut]);

  const toggle = useCallback(async (id: string) => {
    const current = all.find((t) => t.id === id);
    if (!current) return;
    await updateMut.mutateAsync({ id, patch: { completed: !current.completed } });
  }, [all, updateMut]);

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
    if (all.length === 0) return;
    const allCompleted = all.every((t) => t.completed);
    await bulkMut.mutateAsync({ patch: { completed: !allCompleted } });
  }, [all, bulkMut]);

  const loading =
    isLoading ||
    addMut.isPending ||
    updateMut.isPending ||
    deleteMut.isPending ||
    clearMut.isPending ||
    bulkMut.isPending;

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
