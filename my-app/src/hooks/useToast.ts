import { useCallback, useState } from "react";

export interface ToastMessage {
  id: string;
  text: string;
  type?: "success" | "error" | "info";
}

export function useToast() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const show = useCallback(
    (text: string, type: "success" | "error" | "info" = "success") => {
      const id = crypto.randomUUID();
      setMessages((prev) => [...prev, { id, text, type }]);
      setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }, 3000);
    },
    []
  );

  return { messages, show };
}
