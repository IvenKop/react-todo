// src/__tests__/language-switcher.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LanguageSwitcher from "../components/LanguageSwitcher";
import i18next from "i18next";
import type { i18n as I18nType } from "i18next";

import { I18nextProvider, initReactI18next } from "react-i18next";

async function makeI18n(lng = "en"): Promise<I18nType> {
  const inst = i18next.createInstance();
  await inst.use(initReactI18next).init({
    lng,
    fallbackLng: "en",
    resources: { en: { translation: {} }, ru: { translation: {} } },
  });
  return inst;
}

it("opens dropdown and changes language to ru", async () => {
  const i18n = await makeI18n();
  const user = userEvent.setup();

  render(
    <I18nextProvider i18n={i18n}>
      <LanguageSwitcher />
    </I18nextProvider>,
  );

  await user.click(screen.getByRole("combobox", { name: /change language/i }));

  const ru = await screen.findByRole("option", { name: "Русский" });
  await user.click(ru);

  expect(i18n.language).toBe("ru");
});
