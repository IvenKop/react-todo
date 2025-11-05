import { useEffect, useCallback, useRef } from "react";
import type { Todo, Filter } from "../types";
import { socket } from "../realtime/socket";
import { EV } from "../realtime/events";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { todosActions, selectTodosState } from "../store/todosSlice";
import type { AppDispatch } from "../store/store";

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
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector(selectTodosState);

  const { items, total, loading, error, active_total, completed_total, counters } = state;

  useEffect(() => {
    dispatch(todosActions.fetchTodosRequest({ filter, page, limit: pageSize }));
  }, [dispatch, filter, page, pageSize]);

  useEffect(() => {
    const invalidate = () =>
      dispatch(todosActions.fetchTodosRequest({ filter, page, limit: pageSize }));
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
  }, [dispatch, filter, page, pageSize]);

  const prev = useRef(counters);
  useEffect(() => {
    if (toast) {
      if (counters.add !== prev.current.add) toast.show(t("toast.added"), "success");
      if (counters.update !== prev.current.update) toast.show(t("toast.updated"), "success");
      if (counters.delete !== prev.current.delete) toast.show(t("toast.deleted"), "info");
      if (counters.clear !== prev.current.clear) toast.show(t("toast.cleared"), "info");
      if (counters.bulk !== prev.current.bulk) toast.show(t("toast.bulkUpdated"), "success");
    }
    prev.current = counters;
  }, [counters, t, toast]);

  const add = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      dispatch(todosActions.addTodoRequest({ text: trimmed }));
    },
    [dispatch]
  );

  const toggle = useCallback(
    async (id: string) => {
      const current = items.find((t) => t.id === id);
      if (!current) return;
      dispatch(
        todosActions.updateTodoRequest({ id, patch: { completed: !current.completed } })
      );
    },
    [dispatch, items]
  );

  const edit = useCallback(
    async (id: string, text: string) => {
      const cleaned = text.trim();
      if (!cleaned) return;
      dispatch(todosActions.updateTodoRequest({ id, patch: { text: cleaned } }));
    },
    [dispatch]
  );

  const remove = useCallback(
    async (id: string) => {
      dispatch(todosActions.deleteTodoRequest({ id }));
    },
    [dispatch]
  );

  const clearCompleted = useCallback(async () => {
    dispatch(todosActions.clearCompletedRequest());
  }, [dispatch]);

  const toggleAll = useCallback(async () => {
    const totalCount = active_total + completed_total;
    if (totalCount === 0) return;
    const allCompleted = active_total === 0;
    dispatch(todosActions.updateTodosBulkRequest({ patch: { completed: !allCompleted } }));
  }, [dispatch, active_total, completed_total]);

  const counts = {
    total: active_total + completed_total,
    active: active_total,
    completed: completed_total,
  };

  return {
    todos: items as Todo[],
    total,
    loading,
    error,
    counts,
    add,
    toggle,
    edit,
    remove,
    clearCompleted,
    toggleAll,
  };
}
