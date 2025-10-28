import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { socket } from "../realtime/socket";

const EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  HELLO: "hello",
  PING: "ping",
} as const;

export default function SocketStatus() {
  const { t } = useTranslation();
  const [connected, setConnected] = useState(socket.connected);
  const [lastHello, setLastHello] = useState<string | null>(null);
  const [pinging, setPinging] = useState(false);
  const pingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);
    const handleHello = (payload: { message: string; time: string }) => {
      setLastHello(
        `${payload.message} — ${new Date(payload.time).toLocaleTimeString()}`,
      );

      if (pingTimeoutRef.current) {
        clearTimeout(pingTimeoutRef.current);
      }
      pingTimeoutRef.current = setTimeout(() => setPinging(false), 3000);
    };

    socket.on(EVENTS.CONNECT, handleConnect);
    socket.on(EVENTS.DISCONNECT, handleDisconnect);
    socket.on(EVENTS.HELLO, handleHello);

    return () => {
      if (pingTimeoutRef.current) {
        clearTimeout(pingTimeoutRef.current);
      }
      socket.off(EVENTS.CONNECT, handleConnect);
      socket.off(EVENTS.DISCONNECT, handleDisconnect);
      socket.off(EVENTS.HELLO, handleHello);
    };
  }, []);

  const handlePing = () => {
    if (!connected) return;
    setPinging(true);
    socket.emit(EVENTS.PING, "Ping from client");
  };

  return (
    <div className="items-left absolute left-[50px] top-[30px] flex flex-col p-[8px] text-sm text-gray-600 shadow-[0_2px_5px_rgba(0,0,0,0.1),0_2px_10px_rgba(0,0,0,0.1)]">
      <div className="mb-[7px] flex items-center gap-2">
        <span
          className={`inline-block h-2.5 w-2.5 rounded-full ${
            connected ? "bg-green-500" : "bg-red-400"
          }`}
        />
        <h4 className="m-0 font-medium text-[rgb(184,63,69)]">
          {connected
            ? t("Realtime connection active")
            : t("Realtime disconnected")}
        </h4>
      </div>

      {lastHello && (
        <div className="mb-[10px] mt-[7px] text-gray-500">
          <span className="font-medium">{t("Realtime last response")}:</span>{" "}
          <span>{lastHello}</span>
        </div>
      )}

      <button
        onClick={handlePing}
        disabled={pinging || !connected}
        className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-1.5 text-gray-700 shadow-sm transition-all duration-150 hover:bg-gray-50 active:scale-[0.98] disabled:opacity-50"
      >
        {pinging ? t("realtime pinging") : t("realtime test connection")}
      </button>
    </div>
  );
}
