import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { AuthProvider } from "./auth/AuthContext";

type Opts = { route?: string; initialEntries?: string[] };

export function renderWithProviders(ui: ReactNode, opts: Opts = {}) {
  const { route = "/", initialEntries = [route] } = opts;
  return render(
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
      </AuthProvider>
    </I18nextProvider>,
  );
}
