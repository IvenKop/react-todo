import { AnimatePresence, motion } from "framer-motion";
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
    [],
  );

  return { messages, show };
}

export function ToastContainer({ messages }: { messages: ToastMessage[] }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`select-none rounded-xl border px-4 py-2 text-sm font-medium shadow-lg backdrop-blur-md ${
              m.type === "success"
                ? "border-green-200 bg-green-50 text-green-800 dark:border-green-700 dark:bg-green-900 dark:text-green-100"
                : m.type === "error"
                  ? "border-red-200 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-900 dark:text-red-100"
                  : "border-gray-200 bg-gray-50 text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            }`}
          >
            {m.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
