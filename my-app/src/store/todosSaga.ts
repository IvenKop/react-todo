import { call, put, takeLatest, takeEvery, select } from "redux-saga/effects";
import { todosActions, selectTodosState } from "./todosSlice";
import * as api from "../api/todos";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Todo } from "../types";

function toError(e: unknown): string {
  if (e instanceof Error) return e.message;
  try {
    return String(e);
  } catch {
    return "Unknown error";
  }
}

function* refetchWithLastQuery() {
  const state: ReturnType<typeof selectTodosState> = yield select(selectTodosState);
  const q = state.lastQuery;
  yield put(todosActions.fetchTodosRequest(q));
}

function* fetchTodosWorker(
  action: PayloadAction<{ filter: api.TodosPage["items"][number] extends never ? never : any; page: number; limit: number }>
) {
  try {
    const { filter, page, limit } = action.payload as { filter: any; page: number; limit: number };
    const data: api.TodosPage = yield call(api.listTodos, filter, page, limit);
    yield put(todosActions.fetchTodosSuccess(data));
  } catch (e) {
    yield put(todosActions.fetchTodosFailure(toError(e)));
  }
}

function* addTodoWorker(action: PayloadAction<{ text: string }>) {
  try {
    yield call(api.addTodo, action.payload.text);
    yield put(todosActions.addTodoSuccess());
    yield call(refetchWithLastQuery);
  } catch (e) {
    yield put(todosActions.addTodoFailure(toError(e)));
  }
}

function* updateTodoWorker(
  action: PayloadAction<{ id: string; patch: Partial<Pick<Todo, "text" | "completed">> }>
) {
  try {
    const { id, patch } = action.payload;
    yield call(api.updateTodo, id, patch);
    yield put(todosActions.updateTodoSuccess());
    yield call(refetchWithLastQuery);
  } catch (e) {
    yield put(todosActions.updateTodoFailure(toError(e)));
  }
}

function* deleteTodoWorker(action: PayloadAction<{ id: string }>) {
  try {
    yield call(api.deleteTodo, action.payload.id);
    yield put(todosActions.deleteTodoSuccess());
    yield call(refetchWithLastQuery);
  } catch (e) {
    yield put(todosActions.deleteTodoFailure(toError(e)));
  }
}

function* clearCompletedWorker() {
  try {
    yield call(api.clearCompleted);
    yield put(todosActions.clearCompletedSuccess());
    yield call(refetchWithLastQuery);
  } catch (e) {
    yield put(todosActions.clearCompletedFailure(toError(e)));
  }
}

function* updateTodosBulkWorker(
  action: PayloadAction<{ patch: Partial<Pick<Todo, "text" | "completed">>; ids?: string[] }>
) {
  try {
    const { patch, ids } = action.payload;
    yield call(api.updateTodosBulk, patch, ids);
    yield put(todosActions.updateTodosBulkSuccess());
    yield call(refetchWithLastQuery);
  } catch (e) {
    yield put(todosActions.updateTodosBulkFailure(toError(e)));
  }
}

export function* todosRootSaga() {
  yield takeLatest(todosActions.fetchTodosRequest.type, fetchTodosWorker);
  yield takeEvery(todosActions.addTodoRequest.type, addTodoWorker);
  yield takeEvery(todosActions.updateTodoRequest.type, updateTodoWorker);
  yield takeEvery(todosActions.deleteTodoRequest.type, deleteTodoWorker);
  yield takeEvery(todosActions.clearCompletedRequest.type, clearCompletedWorker);
  yield takeEvery(todosActions.updateTodosBulkRequest.type, updateTodosBulkWorker);
}
