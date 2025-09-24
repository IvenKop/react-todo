import { useState } from 'react';

type Props = { onAdd: (text: string) => void };

export default function InputBox({ onAdd }: Props) {
  const [value, setValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    const text = value.trim();
    if (!text) return;
    onAdd(text);
    setValue('');
  };

  return (
    <div
      className="
        flex justify-start w-[90%] max-w-[550px] mx-auto
        bg-[rgb(246,246,246)] h-[65px]
        border border-transparent
        shadow-[0_2px_4px_rgba(0,0,0,0.1),0_25px_50px_rgba(0,0,0,0.1)]
        overflow-hidden
        focus-within:border-[#b83f45]
      "
    >
      <input
        className="
          block w-full border-0 bg-transparent p-4
          text-[24px] leading-[1.4] text-[#5c5c5c]
          box-border transition duration-200
          outline-none
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
