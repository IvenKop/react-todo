import { useState } from "react";

type Props = { onAdd: (text: string) => void };

export default function InputBox({ onAdd }: Props) {
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

      <input
        className="input-box__input box-border block w-full border-0 bg-transparent pl-[60px] text-[24px] leading-[1.4] text-[#5c5c5c] outline-none transition duration-200 placeholder:font-[200] placeholder:italic placeholder:text-[#bfbfbf]"
        type="text"
        placeholder="What needs to be done?"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
