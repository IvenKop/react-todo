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
    <div
      className="
        input-box flex justify-start w-full
        bg-[rgb(246,246,246)] h-[65px]
        border border-transparent overflow-hidden
        focus-within:border-[#b83f45]
        focus-within:shadow-[0_2px_5px_rgba(246,37,37,0.3),0_2px_10px_rgba(246,37,37,0.3)]
      "
    >
      <div className="w-[45px] h-[65px] relative border border-transparent hidden"></div>

      <input
        className="
           input-box__input block w-full border-0 bg-transparent
           pl-[60px] text-[24px] leading-[1.4] text-[#5c5c5c] box-border
          transition duration-200 outline-none
          placeholder:italic placeholder:font-[200] placeholder:text-[#bfbfbf]
        "
        type="text"
        placeholder="What needs to be done?"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
