import type { Todo, Filter } from '../types';
import { STORAGE_KEY, FILTER_KEY } from '../types';

export function getTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Todo[]) : [];
  } catch {
    return [];
  }
}

export function setTodos(next: Todo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function getFilter(): Filter {
  const f = localStorage.getItem(FILTER_KEY);
  return f === 'active' || f === 'completed' ? f : 'all';
}

export function setFilter(f: Filter): void {
  localStorage.setItem(FILTER_KEY, f);
}