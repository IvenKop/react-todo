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
    setPinging(true);
    socket.emit("ping", "Ping from client");
  };

  return (
    <div className="mt-8 text-center text-sm text-gray-600">
      <div>
        <span
          className={`mr-1 inline-block h-2 w-2 rounded-full ${
            connected ? "bg-green-500" : "bg-red-500"
          }`}
        ></span>
        {connected ? "Realtime connection active" : "Disconnected"}
      </div>
      {lastHello && (
        <div className="mt-1 text-gray-500">
          Last response: <span className="font-medium">{lastHello}</span>
        </div>
      )}
      <button
        onClick={handlePing}
        disabled={pinging || !connected}
        className="mt-3 rounded-lg border border-gray-300 bg-white px-3 py-1 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        {pinging ? "Pinging..." : "Test connection"}
      </button>
    </div>
  );
}
