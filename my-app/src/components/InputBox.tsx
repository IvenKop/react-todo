import { useState } from 'react';

type Props = {
  onAdd: (text: string) => void;
};

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
    <div className="input-box">
      <input
        className="input-box__input"
        type="text"
        placeholder="What needs to be done?"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
