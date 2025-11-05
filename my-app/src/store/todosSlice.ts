import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { Todo, Filter } from "../types";
import type { TodosPage } from "../api/todos";

type Query = { filter: Filter; page: number; limit: number };

type Counters = {
  add: number;
  update: number;
  delete: number;
  clear: number;
  bulk: number;
};

export type TodosState = {
  items: Todo[];
  total: number;
  page: number;
  limit: number;
  active_total: number;
  completed_total: number;
  loading: boolean;
  error: string | null;
  lastQuery: Query;
  counters: Counters;
};

const initialState: TodosState = {
  items: [],
  total: 0,
  page: 1,
  limit: 20,
  active_total: 0,
  completed_total: 0,
  loading: false,
  error: null,
  lastQuery: { filter: "all", page: 1, limit: 20 },
  counters: { add: 0, update: 0, delete: 0, clear: 0, bulk: 0 },
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    fetchTodosRequest(state, action: PayloadAction<Query>) {
      state.loading = true;
      state.error = null;
      state.lastQuery = action.payload;
    },
    fetchTodosSuccess(state, action: PayloadAction<TodosPage>) {
      state.items = action.payload.items;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.active_total = action.payload.active_total;
      state.completed_total = action.payload.completed_total;
      state.loading = false;
      state.error = null;
    },
    fetchTodosFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    addTodoRequest(state, _action: PayloadAction<{ text: string }>) {
      state.loading = true;
      state.error = null;
    },
    addTodoSuccess(state) {
      state.loading = false;
      state.counters.add += 1;
    },
    addTodoFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    updateTodoRequest(
      state,
      _action: PayloadAction<{ id: string; patch: Partial<Pick<Todo, "text" | "completed">> }>
    ) {
      state.loading = true;
      state.error = null;
    },
    updateTodoSuccess(state) {
      state.loading = false;
      state.counters.update += 1;
    },
    updateTodoFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    deleteTodoRequest(state, _action: PayloadAction<{ id: string }>) {
      state.loading = true;
      state.error = null;
    },
    deleteTodoSuccess(state) {
      state.loading = false;
      state.counters.delete += 1;
    },
    deleteTodoFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    clearCompletedRequest(state) {
      state.loading = true;
      state.error = null;
    },
    clearCompletedSuccess(state) {
      state.loading = false;
      state.counters.clear += 1;
    },
    clearCompletedFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    updateTodosBulkRequest(
      state,
      _action: PayloadAction<{ patch: Partial<Pick<Todo, "text" | "completed">>; ids?: string[] }>
    ) {
      state.loading = true;
      state.error = null;
    },
    updateTodosBulkSuccess(state) {
      state.loading = false;
      state.counters.bulk += 1;
    },
    updateTodosBulkFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const todosActions = todosSlice.actions;
export const todosReducer = todosSlice.reducer;

export const selectTodosState = (s: { todos: TodosState }) => s.todos;
