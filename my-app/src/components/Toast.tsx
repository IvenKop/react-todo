import { AnimatePresence, motion } from "framer-motion";
import type { ToastMessage } from "../hooks/useToast";

export function ToastContainer({ messages }: { messages: ToastMessage[] }) {
  return (
    <div className="fixed bottom-[50px] right-[20px] z-50 flex flex-col">
      <AnimatePresence>
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="m-[5px] select-none rounded-xl border-none p-[5px] text-sm font-medium shadow-[0_2px_5px_rgba(0,0,0,0.1),0_2px_10px_rgba(0,0,0,0.1)] shadow-lg backdrop-blur-md"
          >
            {m.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
