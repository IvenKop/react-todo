import { useEffect, useCallback, useRef, useState } from "react";
import type { Todo, Filter } from "../types";
import { socket } from "../realtime/socket";
import { EV } from "../realtime/events";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  todosActions,
  selectCounters,
  selectCounts,
  selectTodosItems,
  selectTotalItemsCount,
  selectError,
  selectIsLoading,
} from "../store/todosSlice";
import type { AppDispatch } from "../store/store";

type ToastApi = { show: (text: string, type?: "success" | "error" | "info") => void };

type UseTodosOpts = {
  toast?: ToastApi;
  filter: Filter;
  page: number;
  pageSize: number;
};

type WorkerStats = {
  total: number;
  active: number;
  completed: number;
};

export function useTodos(opts: UseTodosOpts) {
  const { toast, filter, page, pageSize } = opts;
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const items = useSelector(selectTodosItems);
  const total = useSelector(selectTotalItemsCount);
  const counts = useSelector(selectCounts);
  const loading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const counters = useSelector(selectCounters);

  const [pageStats, setPageStats] = useState<WorkerStats | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const exportResolverRef = useRef<((csv: string) => void) | null>(null);

  useEffect(() => {
    dispatch(todosActions.fetchTodosRequest({ filter, page, limit: pageSize }));
  }, [dispatch, filter, page, pageSize]);

  useEffect(() => {
    const invalidate = () => dispatch(todosActions.fetchTodosRequest({ filter, page, limit: pageSize }));
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

  useEffect(() => {
    if (typeof Worker === "undefined") return;
    const worker = new Worker(new URL("../workers/todos.worker.ts", import.meta.url), { type: "module" });
    workerRef.current = worker;

    const handleMessage = (event: MessageEvent<any>) => {
      const data = event.data;
      if (!data || typeof data !== "object") return;
      if (data.type === "stats" && data.stats) {
        setPageStats(data.stats as WorkerStats);
      }
      if (data.type === "exportCsv" && typeof data.csv === "string" && exportResolverRef.current) {
        exportResolverRef.current(data.csv);
        exportResolverRef.current = null;
      }
    };

    worker.addEventListener("message", handleMessage);

    return () => {
      worker.removeEventListener("message", handleMessage);
      worker.terminate();
      workerRef.current = null;
      exportResolverRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!workerRef.current) return;
    workerRef.current.postMessage({ type: "stats", todos: items });
  }, [items]);

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
      dispatch(todosActions.updateTodoRequest({ id, patch: { completed: !current.completed } }));
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
    if (counts.total === 0) return;
    const allCompleted = counts.active === 0;
    dispatch(todosActions.updateTodosBulkRequest({ patch: { completed: !allCompleted } }));
  }, [dispatch, counts]);

  const exportCsv = useCallback(() => {
    if (!workerRef.current) return Promise.resolve("");
    return new Promise<string>((resolve) => {
      exportResolverRef.current = resolve;
      workerRef.current?.postMessage({ type: "exportCsv", todos: items });
    });
  }, [items]);

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
    pageStats,
    exportCsv,
  };
}
