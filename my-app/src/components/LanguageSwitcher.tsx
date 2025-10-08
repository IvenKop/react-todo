import * as Select from "@radix-ui/react-select";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const value = useMemo(
    () => (i18n.language || "en").split("-")[0],
    [i18n.language],
  );

  const handleChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("i18nextLng", lang);
  };

  const languageLabels: Record<string, string> = {
    en: "English",
    ru: "Русский",
  };

  return (
    <div className="absolute left-[calc(100%+16px)] top-[12px] z-50">
      <Select.Root value={value} onValueChange={handleChange}>
        <Select.Trigger
          aria-label="Language"
          className="inline-flex min-w-[140px] items-center justify-between gap-[8px] border border-[#e6e6e6] bg-white/95 pb-[8px] pl-[15px] pr-[15px] pt-[8px] text-[14px] text-[#222] shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.06)] outline-none transition-shadow hover:shadow-[0_2px_6px_rgba(0,0,0,0.08),0_10px_28px_rgba(0,0,0,0.08)]"
        >
          <Select.Value placeholder="Language">
            {languageLabels[value] ?? "Language"}
          </Select.Value>
          <Select.Icon className="text-[#777]">▾</Select.Icon>
        </Select.Trigger>

        <Select.Content
          position="popper"
          side="bottom"
          sideOffset={8}
          align="start"
          className="overflow-hidden border border-[#ececec] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
        >
          <Select.Viewport className="p-[4px]">
            <Select.Item
              value="en"
              className="cursor-pointer select-none pb-[10px] pl-[16px] pr-[16px] pt-[10px] text-[14px] text-[#222] outline-none data-[highlighted]:bg-[#f5f5f5]"
            >
              <Select.ItemText>English</Select.ItemText>
            </Select.Item>

            <Select.Item
              value="ru"
              className="cursor-pointer select-none pb-[10px] pl-[16px] pr-[16px] pt-[10px] text-[14px] text-[#222] outline-none data-[highlighted]:bg-[#f5f5f5]"
            >
              <Select.ItemText>Русский</Select.ItemText>
            </Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select.Root>
    </div>
  );
}
