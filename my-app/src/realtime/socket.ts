import { io, type Socket } from "socket.io-client";

type TodoDTO = { id: string; text: string; completed: boolean };

type ServerToClientEvents = {
  hello: (payload: { message: string; time: string }) => void;
  "todos:invalidate": () => void;
  "todo:upsert": (todo: TodoDTO) => void;
  "todo:removed": (payload: { id: string }) => void;
};

type ClientToServerEvents = {
  ping: (text: string) => void;
};

const URL = import.meta.env.VITE_API_URL as string;

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, {
  path: "/socket.io",
});
