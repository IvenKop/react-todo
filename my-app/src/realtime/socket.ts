import { io, type Socket } from "socket.io-client";
import type { Todo } from "../types";
import { EV } from "./events";

type ServerToClientEvents =
  & Record<typeof EV.hello, (payload: { message: string; time: string }) => void>
  & Record<typeof EV.todos.invalidate, () => void>
  & Record<typeof EV.todo.created, (todo: Todo) => void>
  & Record<typeof EV.todo.updated, (todo: Todo) => void>
  & Record<typeof EV.todo.removed, (payload: { id: string }) => void>;

type ClientToServerEvents =
  & Record<typeof EV.ping, (text: string) => void>;

const URL = import.meta.env.VITE_API_URL as string;

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, {
  path: "/socket.io",
});
