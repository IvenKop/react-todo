import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { todosReducer } from "./todosSlice";
import { todosRootSaga } from "./todosSaga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
  middleware: (getDefault) => getDefault({ serializableCheck: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(todosRootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
