import * as Select from "@radix-ui/react-select";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const value = i18n.language?.startsWith("ru") ? "ru" : "en";
  const label = value === "ru" ? "RU" : "EN";

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
        className="inline-flex h-[36px] items-center gap-[8px] rounded-[18px] px-[12px] text-[14px] text-[#1f2937] transition-all duration-[150ms] hover:bg-[#f6f6f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b83f45]/30 active:scale-[1.01]"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
        </svg>
        <span className="hidden font-medium sm:inline">{label}</span>
        <Select.Icon className="ml-[4px] transition-transform duration-[150ms] data-[state=open]:rotate-180">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
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
          sideOffset={8}
          avoidCollisions
          collisionPadding={10}
          className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out z-[60] rounded-[12px] border-[1px] border-[#e1e1e1] bg-[#ffffff] shadow-[0_4px_16px_rgba(0,0,0,0.08)] backdrop-blur-[8px]"
        >
          <Select.Viewport className="min-w-[160px] p-[4px]">
            <Select.Item
              value="en"
              className="cursor-pointer select-none rounded-[8px] px-[12px] py-[8px] text-[14px] text-[#111] outline-none transition-colors data-[highlighted]:bg-[#f6f6f6]"
            >
              <Select.ItemText>English</Select.ItemText>
            </Select.Item>

            <Select.Item
              value="ru"
              className="cursor-pointer select-none rounded-[8px] px-[12px] py-[8px] text-[14px] text-[#111] outline-none transition-colors data-[highlighted]:bg-[#f6f6f6]"
            >
              <Select.ItemText>Русский</Select.ItemText>
            </Select.Item>
          </Select.Viewport>
          <Select.Arrow className="fill-white" />
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
