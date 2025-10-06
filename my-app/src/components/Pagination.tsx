import * as Tabs from "@radix-ui/react-tabs";
import { useTranslation } from "react-i18next";

const MAX_VISIBLE_PAGES = 5;
const EDGE_WINDOW = 3;

type PageItem = { type: "page"; value: number } | { type: "divider" };

type Props = {
  total: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

const pageItem = (n: number): PageItem => ({ type: "page" as const, value: n });
const dividerItem: PageItem = { type: "divider" as const };

function buildPages(curr: number, total: number): PageItem[] {
  if (total <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: total }, (_, i) => pageItem(i + 1));
  }

  if (curr <= EDGE_WINDOW) {
    return [
      ...Array.from({ length: EDGE_WINDOW }, (_, i) => pageItem(i + 1)),
      dividerItem,
      pageItem(total),
    ];
  }

  if (curr >= total - (EDGE_WINDOW - 1)) {
    return [
      pageItem(1),
      dividerItem,
      ...Array.from({ length: EDGE_WINDOW }, (_, i) =>
        pageItem(total - (EDGE_WINDOW - 1) + i),
      ),
    ];
  }

  return [
    pageItem(1),
    dividerItem,
    pageItem(curr - 1),
    pageItem(curr),
    pageItem(curr + 1),
    dividerItem,
    pageItem(total),
  ];
}

export default function Pagination({
  total,
  pageSize,
  currentPage,
  onPageChange,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const { t } = useTranslation();
  if (totalPages <= 1) return null;

  const pages = buildPages(currentPage, totalPages);

  const handlePrev = () => onPageChange(Math.max(1, currentPage - 1));
  const handleNext = () => onPageChange(Math.min(totalPages, currentPage + 1));

  return (
    <nav
      aria-label="Pagination"
      className="mx-auto mb-10 mt-[20px] flex justify-center"
    >
      <Tabs.Root
        value={String(currentPage)}
        onValueChange={(v) => onPageChange(Number(v))}
      >
        <div className="flex select-none items-center gap-[22px] text-[18px] leading-none text-[#333]">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="flex cursor-pointer items-center gap-[6px] border-none bg-transparent transition-transform duration-200 hover:scale-[1.15] disabled:text-[#c9c9c9]"
            aria-label={t("pagination.prev")}
          >
            <span className="text-[#c9c9c9]">‹</span>
            <span>{t("pagination.prev")}</span>
          </button>

          <Tabs.List className="flex items-center gap-[22px]">
            {pages.map((p, i) =>
              p.type === "divider" ? (
                <span key={`dots-${i}`} className="px-[2px]">
                  …
                </span>
              ) : (
                <Tabs.Trigger
                  key={p.value}
                  value={String(p.value)}
                  className="cursor-pointer border-none bg-transparent px-[2px] outline-none hover:underline data-[state=active]:text-[#b83f45]"
                  aria-current={p.value === currentPage ? "page" : undefined}
                >
                  {p.value}
                </Tabs.Trigger>
              ),
            )}
          </Tabs.List>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="flex cursor-pointer items-center gap-[6px] border-none bg-transparent transition-transform duration-200 hover:scale-[1.15] disabled:text-[#c9c9c9]"
            aria-label={t("pagination.next")}
          >
            <span>{t("pagination.next")}</span>
            <span className="text-[#c9c9c9]">›</span>
          </button>
        </div>
      </Tabs.Root>
    </nav>
  );
}
