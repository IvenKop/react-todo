export type Filter = 'all' | 'active' | 'completed';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export const STORAGE_KEY = 'todos-simple';
export const FILTER_KEY = 'todos-filter';