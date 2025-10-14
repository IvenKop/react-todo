import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { AuthProvider } from "../auth/AuthContext";
import i18n from "../i18n";

export function renderApp(ui: React.ReactElement, { route = "/" } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>{ui}</AuthProvider>
      </I18nextProvider>
    </MemoryRouter>,
  );
}
