import type { Todo, Filter } from "../types";
import { getTodos, saveTodos, getFilter, saveFilter } from "../utils/storage";
import { http } from "./http";

const BASE = import.meta.env.VITE_API_URL;

export async function listTodos(filter: Filter = "all"): Promise<Todo[]> {
  if (!BASE) {
    const all = getTodos();
    if (filter === "all") return all;
    if (filter === "active") return all.filter((t) => !t.completed);
    return all.filter((t) => t.completed);
  }
  const data = await http.request<{ items: Todo[] }>(`/api/todos?filter=${filter}&limit=100`);
  return data.items;
}

export async function addTodo(text: string): Promise<Todo> {
  if (!BASE) {
    const all = getTodos();
    const newTodo: Todo = { id: crypto.randomUUID(), text, completed: false };
    const updated = [newTodo, ...all];
    saveTodos(updated);
    return newTodo;
  }
  return await http.request<Todo>("/api/todos", { method: "POST", body: JSON.stringify({ text }) });
}

export async function updateTodo(
  id: string,
  patch: Partial<Pick<Todo, "text" | "completed">>,
): Promise<Todo> {
  if (!BASE) {
    const all = getTodos();
    const updated = all.map((t) => (t.id === id ? { ...t, ...patch } : t));
    saveTodos(updated);
    return updated.find((t) => t.id === id)!;
  }
  return await http.request<Todo>(`/api/todos/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
}

export async function deleteTodo(id: string): Promise<void> {
  if (!BASE) {
    const updated = getTodos().filter((t) => t.id !== id);
    saveTodos(updated);
    return;
  }
  await http.request(`/api/todos/${id}`, { method: "DELETE" });
}

export async function clearCompleted(): Promise<void> {
  if (!BASE) {
    const updated = getTodos().filter((t) => !t.completed);
    saveTodos(updated);
    return;
  }
  await http.request("/api/todos", { method: "DELETE" });
}

export async function updateTodosBulk(
  patch: Partial<Pick<Todo, "text" | "completed">>,
  ids?: string[],
): Promise<void> {
  if (!BASE) {
    const all = getTodos();
    const next =
      ids && ids.length > 0
        ? all.map((t) => (ids.includes(t.id) ? { ...t, ...patch } : t))
        : all.map((t) => ({ ...t, ...patch }));
    saveTodos(next);
    return;
  }
  await http.request<void>("/api/todos", { method: "PATCH", body: JSON.stringify({ ids, patch }) });
}

export { getFilter, saveFilter };
