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

  return (
    <div className="fixed right-6 top-6 z-50">
      <Select.Root value={value} onValueChange={handleChange}>
        <Select.Trigger
          aria-label="Language"
          className="inline-flex items-center gap-2 rounded-lg border border-[#c3c3c3] bg-white px-3 py-2 text-sm text-[#333] shadow-sm transition hover:shadow"
        >
          <Select.Value />
          <Select.Icon>▾</Select.Icon>
        </Select.Trigger>

        <Select.Content
          position="popper"
          sideOffset={6}
          className="rounded-lg border border-[#e5e5e5] bg-white p-1 shadow-lg"
        >
          <Select.Viewport>
            <Select.Item
              value="en"
              className="cursor-pointer select-none rounded px-3 py-2 text-sm text-[#333] outline-none data-[highlighted]:bg-[#f3f3f3]"
            >
              <Select.ItemText>English</Select.ItemText>
            </Select.Item>

            <Select.Item
              value="ru"
              className="cursor-pointer select-none rounded px-3 py-2 text-sm text-[#333] outline-none data-[highlighted]:bg-[#f3f3f3]"
            >
              <Select.ItemText>Русский</Select.ItemText>
            </Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select.Root>
    </div>
  );
}
