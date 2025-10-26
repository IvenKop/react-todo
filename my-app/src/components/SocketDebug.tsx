import { useEffect, useState } from "react";
import { socket } from "../realtime/socket";

export default function SocketDebug() {
  const [connected, setConnected] = useState(socket.connected);
  const [hello, setHello] = useState<string | null>(null);

  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onHello = (payload: { message: string; time: string }) => {
      setHello(
        `${payload.message} (${new Date(payload.time).toLocaleTimeString()})`,
      );
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("hello", onHello);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("hello", onHello);
    };
  }, []);

  return (
    <div className="mt-4 rounded-xl border p-3 shadow">
      <div>
        <b>Socket:</b> {connected ? "connected ✅" : "disconnected ⛔"}
      </div>
      <div className="mt-2">
        <b>Last hello:</b> {hello ?? "—"}
      </div>
      <button
        className="mt-3 rounded-xl border px-3 py-1"
        onClick={() => socket.emit("ping", "Ping from client")}
      >
        Send ping
      </button>
    </div>
  );
}
