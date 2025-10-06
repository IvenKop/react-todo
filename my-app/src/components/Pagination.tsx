import * as Tabs from "@radix-ui/react-tabs";

const MAX_VISIBLE_PAGES = 7;

type PageItem = { value: number; withDivider?: boolean };

type Props = {
  total: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: string) => void;
};

function buildPages(curr: number, total: number): PageItem[] {
  if (total <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: total }, (_, i) => ({ value: i + 1 }));
  }
  if (curr <= 3) {
    return [
      { value: 1 },
      { value: 2 },
      { value: 3, withDivider: true },
      { value: total },
    ];
  }
  if (curr >= total - 2) {
    return [
      { value: 1, withDivider: true },
      { value: total - 2 },
      { value: total - 1 },
      { value: total },
    ];
  }
  return [
    { value: 1, withDivider: true },
    { value: curr - 1 },
    { value: curr },
    { value: curr + 1 },
    { value: total, withDivider: true },
  ];
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

  const handlePrev = () => {
    const next = Math.max(1, currentPage - 1);
    onPageChange(String(next));
  };

  const handleNext = () => {
    const next = Math.min(totalPages, currentPage + 1);
    onPageChange(String(next));
  };

  return (
    <nav
      aria-label="Pagination"
      className="mx-auto mb-10 mt-[20px] flex justify-center"
    >
      <Tabs.Root value={String(currentPage)} onValueChange={onPageChange}>
        <div className="flex select-none items-center gap-[22px] text-[18px] leading-none text-[#333]">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="flex cursor-pointer items-center gap-[6px] border-none bg-transparent transition-transform duration-200 hover:scale-[1.15] disabled:text-[#c9c9c9]"
            aria-label="Previous page"
          >
            <span className="text-[#c9c9c9]">‹</span>
            <span>Prev</span>
          </button>

          <Tabs.List className="flex items-center gap-[22px]">
            {pages.map((p, i) => (
              <div
                key={`${p.value}-${i}`}
                className="flex items-center gap-[22px]"
              >
                <Tabs.Trigger
                  value={String(p.value)}
                  className="cursor-pointer border-none bg-transparent px-[2px] outline-none hover:underline data-[state=active]:text-[#b83f45]"
                  aria-current={p.value === currentPage ? "page" : undefined}
                >
                  {p.value}
                </Tabs.Trigger>
                {p.withDivider && <span className="px-[2px]">…</span>}
              </div>
            ))}
          </Tabs.List>

          <button
            type="button"
            onClick={handleNext}
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
