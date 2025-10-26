import { useEffect, useState } from "react";
import { socket } from "../realtime/socket";

export default function SocketStatus() {
  const [connected, setConnected] = useState(socket.connected);
  const [lastHello, setLastHello] = useState<string | null>(null);
  const [pinging, setPinging] = useState(false);

  useEffect(() => {
    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);
    const handleHello = (payload: { message: string; time: string }) => {
      setLastHello(
        `${payload.message} — ${new Date(payload.time).toLocaleTimeString()}`,
      );
      setPinging(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("hello", handleHello);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("hello", handleHello);
    };
  }, []);

  const handlePing = () => {
    if (!connected) return;
    setPinging(true);
    socket.emit("ping", "Ping from client");
  };

  return (
    <div className="mt-10 flex flex-col items-center text-sm text-gray-600">
      <div className="mb-1 flex items-center gap-2">
        <span
          className={`inline-block h-2.5 w-2.5 rounded-full ${
            connected ? "bg-green-500" : "bg-red-400"
          }`}
        ></span>
        <span className="font-medium">
          {connected ? "Realtime connection active" : "Disconnected"}
        </span>
      </div>

      {lastHello && (
        <div className="mb-3 text-gray-500">
          <span className="font-medium">Last response:</span>{" "}
          <span>{lastHello}</span>
        </div>
      )}

      <button
        onClick={handlePing}
        disabled={pinging || !connected}
        className={`rounded-lg border border-gray-300 bg-white px-4 py-1.5 text-gray-700 shadow-sm transition-all duration-150 hover:bg-gray-50 active:scale-[0.98] disabled:opacity-50`}
      >
        {pinging ? "Pinging..." : "Test connection"}
      </button>
    </div>
  );
}
