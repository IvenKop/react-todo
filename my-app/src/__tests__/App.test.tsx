import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18nTest from "../test/i18n-test";
import App from "../App";

vi.mock("../hooks/useAuth", () => ({ useAuth: () => ({ isAuthed: true }) }));

it("adds item, toggles complete, filters", async () => {
  render(
    <I18nextProvider i18n={i18nTest}>
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    </I18nextProvider>,
  );

  const user = userEvent.setup();
  const input = screen.getByPlaceholderText(/what needs to be done\?/i);

  await user.type(input, "first{enter}");
  await screen.findByText(/^first$/i);

  await user.type(input, "second{enter}");
  await screen.findByText(/^second$/i);

  const firstRow = screen.getByText(/^first$/i).closest("li")!;
  const firstToggle = within(firstRow).getByRole("button", {
    name: /toggle completed/i,
  });
  await user.click(firstToggle);

  await user.click(screen.getByRole("button", { name: /^completed$/i }));
  expect(screen.getByText(/^first$/i)).toBeInTheDocument();
  expect(screen.queryByText(/^second$/i)).not.toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /^active$/i }));
  expect(screen.getByText(/^second$/i)).toBeInTheDocument();
  expect(screen.queryByText(/^first$/i)).not.toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /^all$/i }));
  await user.click(screen.getByRole("button", { name: /clear completed/i }));
  expect(screen.queryByText(/^first$/i)).not.toBeInTheDocument();
  expect(screen.getByText(/^second$/i)).toBeInTheDocument();
});
