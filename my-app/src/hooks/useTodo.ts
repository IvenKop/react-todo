import { useEffect, useCallback } from "react";
import type { Todo, Filter } from "../types";
import {
  listTodos,
  addTodo as apiAdd,
  updateTodo as apiUpdate,
  deleteTodo as apiDelete,
  clearCompleted as apiClearCompleted,
  updateTodosBulk as apiUpdateBulk,
} from "../api/todos";
import { socket } from "../realtime/socket";
import { EV } from "../realtime/events";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "../lib/queryKeys";
import { useTranslation } from "react-i18next";
import { errorText } from "../lib/erros";

type ToastApi = { show: (text: string, type?: "success" | "error" | "info") => void };

type UseTodosOpts = {
  toast?: ToastApi;
  filter: Filter;
  page: number;
  pageSize: number;
};

export function useTodos(opts: UseTodosOpts) {
  const { toast, filter, page, pageSize } = opts;
  const { t } = useTranslation();
  const qc = useQueryClient();

  const {
    data,
    isLoading: isLoadingList,
    isError: isErrorList,
    error: errorList,
  } = useQuery({
    queryKey: qk.todos(filter, page, pageSize),
    queryFn: () => listTodos(filter, page, pageSize),
  });

  const todos = (data?.items ?? []) as Todo[];
  const total = data?.total ?? 0;
  const counts = {
    total: (data?.active_total ?? 0) + (data?.completed_total ?? 0),
    active: data?.active_total ?? 0,
    completed: data?.completed_total ?? 0,
  };

  const invalidateTodos = useCallback(
    (toastKey?: string, type?: "success" | "error" | "info") => {
      (["all", "active", "completed"] as const).forEach((f) => {
        qc.invalidateQueries({ queryKey: ["todos", f] });
      });
      if (toastKey) toast?.show(t(toastKey), type);
    },
    [qc, t, toast],
  );

  const addMut = useMutation({
    mutationFn: (text: string) => apiAdd(text),
    onSuccess: () => invalidateTodos("toast.added", "success"),
    onError: (e) => toast?.show(errorText(e), "error"),
  });

  const updateMut = useMutation({
    mutationFn: (args: { id: string; patch: Partial<Pick<Todo, "text" | "completed">> }) =>
      apiUpdate(args.id, args.patch),
    onSuccess: () => invalidateTodos("toast.updated", "success"),
    onError: (e) => toast?.show(errorText(e), "error"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => apiDelete(id),
    onSuccess: () => invalidateTodos("toast.deleted", "info"),
    onError: (e) => toast?.show(errorText(e), "error"),
  });

  const clearMut = useMutation({
    mutationFn: () => apiClearCompleted(),
    onSuccess: () => invalidateTodos("toast.cleared", "info"),
    onError: (e) => toast?.show(errorText(e), "error"),
  });

  const bulkMut = useMutation({
    mutationFn: (args: { patch: Partial<Pick<Todo, "text" | "completed">>; ids?: string[] }) =>
      apiUpdateBulk(args.patch, args.ids),
    onSuccess: () => invalidateTodos("toast.bulkUpdated", "success"),
    onError: (e) => toast?.show(errorText(e), "error"),
  });

  useEffect(() => {
    const invalidate = () => invalidateTodos();
    socket.on(EV.todos.invalidate, invalidate);
    socket.on(EV.todo.created, invalidate);
    socket.on(EV.todo.updated, invalidate);
    socket.on(EV.todo.removed, invalidate);

    return () => {
      socket.off(EV.todos.invalidate, invalidate);
      socket.off(EV.todo.created, invalidate);
      socket.off(EV.todo.updated, invalidate);
      socket.off(EV.todo.removed, invalidate);
    };
  }, [invalidateTodos]);

  const add = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      await addMut.mutateAsync(trimmed);
    },
    [addMut],
  );

  const toggle = useCallback(
    async (id: string) => {
      const current = todos.find((t) => t.id === id);
      if (!current) return;
      await updateMut.mutateAsync({ id, patch: { completed: !current.completed } });
    },
    [todos, updateMut],
  );

  const edit = useCallback(
    async (id: string, text: string) => {
      const cleaned = text.trim();
      if (!cleaned) return;
      await updateMut.mutateAsync({ id, patch: { text: cleaned } });
    },
    [updateMut],
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteMut.mutateAsync(id);
    },
    [deleteMut],
  );

  const clearCompleted = useCallback(async () => {
    await clearMut.mutateAsync();
  }, [clearMut]);

  const toggleAll = useCallback(async () => {
    if (counts.total === 0) return;
    const allCompleted = counts.active === 0;
    await bulkMut.mutateAsync({ patch: { completed: !allCompleted } });
  }, [counts, bulkMut]);

  const loading =
    isLoadingList ||
    addMut.isPending ||
    updateMut.isPending ||
    deleteMut.isPending ||
    clearMut.isPending ||
    bulkMut.isPending;

  return {
    todos,
    total,
    loading,
    error: isErrorList ? errorText(errorList) : null,
    counts,
    add,
    toggle,
    edit,
    remove,
    clearCompleted,
    toggleAll,
  };
}
