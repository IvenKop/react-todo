import { useEffect, useRef, useState, useCallback } from "react";
import clsx from "clsx";
import type { Todo } from "../types";

type Props = {
  todos: Todo[];
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onToggle: (id: string) => void;
};

export default function TaskList({ todos, onDelete, onEdit, onToggle }: Props) {
  if (todos.length === 0) return null;

  return (
    <ul
      className="
        relative list-none p-0 m-0 block z-[2]
        bg-[rgb(246,246,246)] border-t border-[#c3c3c3]
        before:content-[''] before:absolute before:bottom-[-42px] before:left-0 before:right-0
        before:h-[50px] before:overflow-hidden
        before:shadow-[0_1px_1px_rgba(0,0,0,0.2),0_8px_0_-3px_#f6f6f6,0_9px_1px_-3px_rgba(0,0,0,0.2),0_16px_0_-6px_#f6f6f6,0_17px_2px_-6px_rgba(0,0,0,0.2)]
      "
    >
      {todos.map((t) => (
        <TaskItem
          key={t.id}
          todo={t}
          onDelete={onDelete}
          onEdit={onEdit}
          onToggle={onToggle}
        />
      ))}
    </ul>
  );
}

function TaskItem({
  todo,
  onDelete,
  onEdit,
  onToggle,
}: {
  todo: Todo;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onToggle: (id: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) return;
    inputRef.current?.focus();
    const v = inputRef.current!.value;
    inputRef.current!.setSelectionRange(v.length, v.length);
  }, [isEditing]);

  const onEditFinished = useCallback(
    (commit: boolean) => {
      const next = editedText.trim();
      if (commit && next && next !== todo.text) {
        onEdit(todo.id, next);
      } else {
        setEditedText(todo.text);
      }
      setIsEditing(false);
    },
    [editedText, onEdit, todo.id, todo.text]
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('button[aria-label="Delete todo"]'))
        return;
      if (!isEditing) setIsEditing(true);
    },
    [isEditing]
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedText(e.target.value);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") onEditFinished(true);
      else if (e.key === "Escape") onEditFinished(false);
    },
    [onEditFinished]
  );

  const handleBlur = useCallback(() => {
    onEditFinished(true);
  }, [onEditFinished]);

  const handleDeleteClick = useCallback(() => {
    onDelete(todo.id);
  }, [onDelete, todo.id]);

  const handleToggleClick = useCallback(() => {
    onToggle(todo.id);
  }, [onToggle, todo.id]);

  return (
    <li
      className={clsx(
        "group relative p-[16px] pl-[60px] pr-[76px] text-[24px] leading-[1.4] border-b border-[#c3c3c3] z-[2]",
        isEditing && "outline outline-1 outline-[#b83f45]"
      )}
      onDoubleClick={handleDoubleClick}
    >
      {!isEditing && (
        <button
          type="button"
          aria-label="Toggle completed"
          aria-pressed={todo.completed}
          onClick={handleToggleClick}
          className={clsx(
            "absolute left-[10px] top-1/2 -translate-y-1/2 w-[28px] h-[28px] rounded-full",
            "border-2 border-[#dcdcdc] bg-transparent cursor-pointer appearance-none",
            "transition-[border-color,background-color,box-shadow] duration-[150ms]",
            "hover:border-[#bfbfbf] hover:bg-[rgba(0,0,0,0.02)]",
            "focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgba(0,0,0,0.08)]",
            todo.completed && "border-[#59a193] bg-[#59a193]"
          )}
        >
          <span
            className={clsx(
              "absolute left-1/2 top-1/2",
              "block w-[12px] h-[7px] border-l-2 border-b-2",
              "transform -translate-x-1/2 -translate-y-[60%] -rotate-45",
              "transition-[opacity,border-color] duration-[150ms]",
              todo.completed
                ? "opacity-100 border-[#59a193]"
                : "opacity-0 border-transparent"
            )}
          />
        </button>
      )}

      {!isEditing ? (
        <span
          className={clsx(
            "block max-w-full break-words whitespace-normal",
            todo.completed && "text-[#9b9b9b] line-through"
          )}
        >
          {todo.text}
        </span>
      ) : (
        <input
          ref={inputRef}
          type="text"
          value={editedText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="
            block w-full box-border
            bg-transparent border-0 outline-none focus:ring-0
            p-0 m-0 text-[24px] leading-[1.4]
          "
        />
      )}

      {!isEditing && (
        <button
          type="button"
          aria-label="Delete todo"
          title="Delete"
          onClick={handleDeleteClick}
          className="
            group/delete absolute right-[10px] top-1/2 -translate-y-1/2
            w-[45px] h-[45px] border border-transparent bg-transparent cursor-pointer appearance-none
            opacity-0 pointer-events-none transition-[opacity,border-color,background-color,box-shadow] duration-150
            group-hover:opacity-100 group-hover:pointer-events-auto
            focus-visible:opacity-100 focus-visible:pointer-events-auto
            focus-visible:border-[#b83f45] focus-visible:shadow-[0_0_0_2px_rgba(184,63,69,0.12)]
            active:border-[#b83f45] active:shadow-[0_0_0_2px_rgba(184,63,69,0.12)]
          "
        >
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 block w-[25px] h-[2px] bg-[#bfbfbf] rounded-[1px] rotate-45 transition-colors duration-150 group-hover/delete:bg-[#bd8787]" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 block w-[25px] h-[2px] bg-[#bfbfbf] rounded-[1px] -rotate-45 transition-colors duration-150 group-hover/delete:bg-[#bd8787]" />
        </button>
      )}
    </li>
  );
}
