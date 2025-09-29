import { useState } from "react";

type Props = {
  onAdd: (text: string) => void;
  isListEmpty?: boolean;
  isAllSelected?: boolean;
  onToggleAll?: () => void;
};

export default function TaskInput({
  onAdd,
  isListEmpty,
  isAllSelected,
  onToggleAll,
}: Props) {
  const [value, setValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const text = value.trim();
    if (!text) return;
    onAdd(text);
    setValue("");
  };

  return (
    <div className="input-box flex h-[65px] w-full justify-start overflow-hidden border border-transparent bg-[rgb(246,246,246)] focus-within:border-[#b83f45] focus-within:shadow-[0_2px_5px_rgba(246,37,37,0.3),0_2px_10px_rgba(246,37,37,0.3)]">
      <div className="relative hidden h-[65px] w-[45px] border border-transparent"></div>
      {isListEmpty && (
        <label className="relative m-0 h-[65px] w-[45px] shrink-0 cursor-pointer border border-transparent bg-transparent p-0">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={!!isAllSelected}
            onChange={onToggleAll}
          />
          <span className="absolute inset-0 flex items-center justify-center transition-[border-color,box-shadow,background-color] duration-[150ms] peer-focus-visible:border-[#b83f45] peer-focus-visible:shadow-[0_2px_5px_rgba(246,37,37,0.3),0_2px_10px_rgba(246,37,37,0.3)]" />
          <span
            aria-hidden
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 transform text-[22px] leading-none transition-colors duration-[150ms] ${isAllSelected ? "text-[#b83f45]" : "text-[#bfbfbf]"}`}
          >
            ❯
          </span>
        </label>
      )}

      <input
        className="box-border block w-full border-0 bg-transparent p-4 pl-[16px] text-[24px] leading-[1.4] text-[#5c5c5c] outline-none transition duration-200 placeholder:font-[200] placeholder:italic placeholder:text-[#bfbfbf]"
        type="text"
        placeholder="What needs to be done?"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
