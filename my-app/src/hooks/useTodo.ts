import { useEffect, useCallback, useMemo } from "react";
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
};

type ListResp =
  | Todo[]
  | {
      items: Todo[];
      total_task_count?: number;
      filtered_task_count?: number;
      active_task_count?: number;
      completed_task_count?: number;
    };

function itemsOf(resp?: ListResp): Todo[] {
  if (!resp) return [];
  return Array.isArray(resp) ? resp : resp.items;
}

export function useTodos(opts: UseTodosOpts) {
  const { toast, filter } = opts;
  const { t } = useTranslation();
  const qc = useQueryClient();

  const {
    data: listResp,
    isLoading: isLoadingList,
    isError: isErrorList,
    error: errorList,
  } = useQuery({
    queryKey: qk.todos(filter),
    queryFn: () => listTodos(filter),
  });

  const todos = itemsOf(listResp);

  const { data: allResp, isLoading: isLoadingAll } = useQuery({
    queryKey: qk.todos("all"),
    queryFn: () => listTodos("all"),
  });

  const all = itemsOf(allResp);

  const counts = useMemo(() => {
    const total = all.length;
    const active = all.filter((t) => !t.completed).length;
    const completed = total - active;
    return { total, active, completed };
  }, [all]);

  const invalidateTodos = useCallback(
    (toastKey?: string, type?: "success" | "error" | "info") => {
      (["all", "active", "completed"] as const).forEach((f) =>
        qc.invalidateQueries({ queryKey: qk.todos(f) })
      );
      if (toastKey) toast?.show(t(toastKey), type);
    },
    [qc, t, toast]
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
      if (!text.trim()) return;
      await addMut.mutateAsync(text.trim());
    },
    [addMut]
  );

  const toggle = useCallback(
    async (id: string) => {
      const current = all.find((t) => t.id === id);
      if (!current) return;
      await updateMut.mutateAsync({ id, patch: { completed: !current.completed } });
    },
    [all, updateMut]
  );

  const edit = useCallback(
    async (id: string, text: string) => {
      const ttext = text.trim();
      if (!ttext) return;
      await updateMut.mutateAsync({ id, patch: { text: ttext } });
    },
    [updateMut]
  );

  const remove = useCallback(async (id: string) => {
    await deleteMut.mutateAsync(id);
  }, [deleteMut]);

  const clearCompleted = useCallback(async () => {
    await clearMut.mutateAsync();
  }, [clearMut]);

  const toggleAll = useCallback(async () => {
    if (all.length === 0) return;
    const allCompleted = all.every((t) => t.completed);
    await bulkMut.mutateAsync({ patch: { completed: !allCompleted } });
  }, [all, bulkMut]);

  const loading =
    isLoadingList ||
    isLoadingAll ||
    addMut.isPending ||
    updateMut.isPending ||
    deleteMut.isPending ||
    clearMut.isPending ||
    bulkMut.isPending;

  return {
    todos,
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
