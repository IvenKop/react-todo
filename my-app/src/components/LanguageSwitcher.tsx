import * as Select from "@radix-ui/react-select";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const value = i18n.language?.startsWith("ru") ? "ru" : "en";

  const onChange = (v: string) => {
    i18n.changeLanguage(v);
    try {
      localStorage.setItem("i18nextLng", v);
    } catch {}
  };

  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger
        aria-label="Change language"
        className="group inline-flex h-[36px] w-[36px] items-center justify-center rounded-full text-[#374151] transition-[background-color,transform] duration-[150ms] hover:bg-[#f6f6f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b83f45]/30 active:scale-[1.02]"
      >
        <Select.Icon
          aria-hidden="true"
          className="transition-transform duration-150 data-[state=open]:rotate-180"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          side="bottom"
          align="end"
          position="popper"
          sideOffset={6}
          className="z-[60] origin-top-right scale-95 rounded-[12px] border border-[#e1e1e1] bg-white p-[6px] opacity-0 shadow-xl transition-[opacity,transform] duration-[150ms] data-[state=open]:scale-100 data-[state=open]:opacity-100"
        >
          <Select.Viewport className="min-w-[160px]">
            <Select.Item
              value="en"
              className="cursor-pointer select-none rounded-[8px] px-[12px] py-[8px] text-[14px] text-[#111] outline-none hover:bg-[#f6f6f6] focus:bg-[#f6f6f6]"
            >
              <Select.ItemText>English</Select.ItemText>
            </Select.Item>
            <Select.Item
              value="ru"
              className="cursor-pointer select-none rounded-[8px] px-[12px] py-[8px] text-[14px] text-[#111] outline-none hover:bg-[#f6f6f6] focus:bg-[#f6f6f6]"
            >
              <Select.ItemText>Русский</Select.ItemText>
            </Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
