import type { ReactNode, ReactElement } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { AuthProvider } from "./auth/AuthContext";

type Opts = { route?: string; initialEntries?: string[] };

export function TestProviders({ children }: { children: ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>
      </AuthProvider>
    </I18nextProvider>
  );
}

export function renderWithProviders(ui: ReactElement, opts: Opts = {}) {
  const { route = "/", initialEntries = [route] } = opts;
  return render(
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
      </AuthProvider>
    </I18nextProvider>,
  );
}
