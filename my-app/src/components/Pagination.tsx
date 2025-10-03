import * as Tabs from "@radix-ui/react-tabs";

type Props = {
  total: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

function buildPages(curr: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (curr <= 3) return [1, 2, 3, "…", total];
  if (curr >= total - 2) return [1, "…", total - 2, total - 1, total];
  return [1, "…", curr - 1, curr, curr + 1, "…", total];
}

export default function Pagination({
  total,
  pageSize,
  currentPage,
  onPageChange,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const pages = buildPages(currentPage, totalPages);

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
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex cursor-pointer items-center gap-[6px] border-none bg-transparent transition-transform duration-200 hover:scale-[1.15] disabled:text-[#c9c9c9]"
            aria-label="Previous page"
          >
            <span className="text-[#c9c9c9]">‹</span>
            <span>Prev</span>
          </button>

          <Tabs.List className="flex items-center gap-[22px]">
            {pages.map((p, i) =>
              p === "…" ? (
                <span key={`dots-${i}`} className="px-[2px]">
                  …
                </span>
              ) : (
                <Tabs.Trigger
                  key={p}
                  value={String(p)}
                  className="cursor-pointer border-none bg-transparent px-[2px] outline-none hover:underline data-[state=active]:text-[#b83f45]"
                  aria-current={p === currentPage ? "page" : undefined}
                >
                  {p}
                </Tabs.Trigger>
              ),
            )}
          </Tabs.List>

          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="flex cursor-pointer items-center gap-[6px] border-none bg-transparent transition-transform duration-200 hover:scale-[1.15] disabled:text-[#c9c9c9]"
            aria-label="Next page"
          >
            <span>Next</span>
            <span className="text-[#c9c9c9]">›</span>
          </button>
        </div>
      </Tabs.Root>
    </nav>
  );
}
