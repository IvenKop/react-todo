import clsx from "clsx";
import type { Filter } from "../types";

type Props = {
  activeCount: number;
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  onClearCompleted: () => void;
};

function pluralize(n: number) {
  return n === 1 ? "item left!" : "items left!";
}

export default function InfoMenu({
  activeCount,
  filter,
  setFilter,
  onClearCompleted,
}: Props) {
  return (
    <section
      aria-label="Todo footer"
      className="relative z-[2] mx-auto flex w-[95%] max-w-[680px] items-center justify-between border-t border-[#e6e6e6] bg-transparent px-[10px] py-0 text-[14px] text-[#6b6b6b]"
    >
      <p className="whitespace-nowrap">
        {activeCount} {pluralize(activeCount)}
      </p>

      <div className="flex items-center gap-[10px] font-[100]" role="tablist">
        <button
          type="button"
          aria-pressed={filter === "all"}
          onClick={() => setFilter("all")}
          className={clsx(
            "cursor-pointer rounded border border-transparent bg-transparent px-2 py-[3px] text-[#6b6b6b] transition-[border-color,color,background-color] duration-150",
            "hover:border-[#b83f45]",
            filter === "all" &&
              "border-[#b83f45] shadow-[0_0px_3px_rgba(246,37,37,0.3),0_0px_5px_rgba(246,37,37,0.3)]",
          )}
        >
          All
        </button>
        <button
          type="button"
          aria-pressed={filter === "active"}
          onClick={() => setFilter("active")}
          className={clsx(
            "cursor-pointer rounded border border-transparent bg-transparent px-2 py-[3px] text-[#6b6b6b] transition-[border-color,color,background-color] duration-150",
            "hover:border-[#b83f45]",
            filter === "active" &&
              "border-[#b83f45] shadow-[0_0px_3px_rgba(246,37,37,0.3),0_0px_5px_rgba(246,37,37,0.3)]",
          )}
        >
          Active
        </button>
        <button
          type="button"
          aria-pressed={filter === "completed"}
          onClick={() => setFilter("completed")}
          className={clsx(
            "cursor-pointer rounded border border-transparent bg-transparent px-2 py-[3px] text-[#6b6b6b] transition-[border-color,color,background-color] duration-150",
            "hover:border-[#b83f45]",
            filter === "completed" &&
              "border-[#b83f45] shadow-[0_0px_3px_rgba(246,37,37,0.3),0_0px_5px_rgba(246,37,37,0.3)]",
          )}
        >
          Completed
        </button>
      </div>

      <button
        type="button"
        onClick={onClearCompleted}
        className="cursor-pointer rounded border-none bg-transparent px-[6px] py-[3px] text-[#6b6b6b] hover:underline"
      >
        Clear completed
      </button>
    </section>
  );
}
