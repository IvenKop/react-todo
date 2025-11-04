import { AnimatePresence, motion } from "framer-motion";
import type { ToastMessage } from "../hooks/useToast";

const tone = {
  success:
    "bg-[#ffffff] text-[#222222] border-l-[4px] border-l-[#2CA36A] ring-[1px] ring-[#e6e6e6]",
  error:
    "bg-[#ffffff] text-[#222222] border-l-[4px] border-l-[#b83f45] ring-[1px] ring-[#e6e6e6]",
  info: "bg-[#ffffff] text-[#222222] border-l-[4px] border-l-[#b83f45] ring-[1px] ring-[#e6e6e6]",
} as const;

export function ToastContainer({ messages }: { messages: ToastMessage[] }) {
  return (
    <div className="fixed bottom-[30px] right-[30px] z-[9999] flex flex-col items-end gap-[12px]">
      <AnimatePresence initial={false}>
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className={` ${tone[m.type ?? "info"]} w-[320px] select-none rounded-[12px] px-[18px] py-[16px] text-[16px] font-medium leading-[22px] shadow-[0_6px_18px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.06)] backdrop-blur-[6px] sm:w-[380px] md:w-[440px]`}
          >
            {m.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
