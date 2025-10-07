import clsx from "clsx";
import type { Filter } from "../types";
import { useTranslation } from "react-i18next";

type Props = {
  activeCount: number;
  filter: Filter;
  setFilter: (f: Filter) => void;
  onClearCompleted: () => void;
};

export default function InfoMenu({
  activeCount,
  filter,
  setFilter,
  onClearCompleted,
}: Props) {
  const { t } = useTranslation();

  return (
    <section
      aria-label="Todo footer"
      className="relative z-[2] flex w-[100%] max-w-[680px] items-center justify-between border-b border-[#c3c3c3] bg-transparent px-[10px] px-[20px] py-0 text-[14px] text-[#6b6b6b]"
    >
      <p className="whitespace-nowrap">
        {t("infoMenu.itemsLeft", { count: activeCount })}
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
          {t("infoMenu.all")}
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
          {t("infoMenu.active")}
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
          {t("infoMenu.completed")}
        </button>
      </div>

      <button
        type="button"
        onClick={onClearCompleted}
        className="cursor-pointer rounded border-none bg-transparent px-[6px] py-[3px] text-[#6b6b6b] hover:underline"
      >
        {t("infoMenu.clearCompleted")}
      </button>
    </section>
  );
}
