import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { vi } from "vitest";

const changeLanguageMock = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: { language: "en", changeLanguage: changeLanguageMock },
  }),
}));

test("opens dropdown and changes language to ru", async () => {
  render(<LanguageSwitcher />);
  const user = userEvent.setup();

  await user.click(screen.getByRole("combobox", { name: /change language/i }));
  await user.click(screen.getByRole("option", { name: /русский/i }));

  expect(changeLanguageMock).toHaveBeenCalledWith("ru");
});
