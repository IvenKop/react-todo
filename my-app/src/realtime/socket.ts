import { io, type Socket } from "socket.io-client";

type ServerToClientEvents = {
  hello: (payload: { message: string; time: string }) => void;
};

type ClientToServerEvents = {
  ping: (text: string) => void;
};

const URL = import.meta.env.VITE_API_URL as string;

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL);
