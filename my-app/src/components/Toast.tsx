import { useEffect, useState } from "react";

export function useToast() {
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 2200);
    return () => clearTimeout(t);
  }, [message]);
  return { message, show: setMessage };
}

export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      className="fixed bottom-4 right-4 z-50 rounded-xl border bg-white/90 px-4 py-2 shadow"
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
