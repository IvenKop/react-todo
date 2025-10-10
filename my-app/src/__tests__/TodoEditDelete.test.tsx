import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { renderApp } from "./renderApp";

describe("Todo — edit & delete", () => {
  test("double click → edit → Enter saves", async () => {
    renderApp(<App />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText(/what needs to be done\?/i);
    await user.type(input, "first{enter}");

    const row = screen.getByText(/^first$/i).closest("li")!;
    await user.dblClick(within(row).getByText(/^first$/i));

    const editor = within(row).getByRole("textbox");
    await user.clear(editor);
    await user.type(editor, "first edited{Enter}");

    expect(screen.getByText(/^first edited$/i)).toBeInTheDocument();
    expect(screen.queryByText(/^first$/i)).not.toBeInTheDocument();
  });

  test("double click → edit → Escape cancels", async () => {
    renderApp(<App />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText(/what needs to be done\?/i);
    await user.type(input, "original{enter}");

    const row = screen.getByText(/^original$/i).closest("li")!;
    await user.dblClick(within(row).getByText(/^original$/i));

    const editor = within(row).getByRole("textbox");
    await user.type(editor, " (changed){Escape}");

    expect(screen.getByText(/^original$/i)).toBeInTheDocument();
    expect(screen.queryByText(/changed/i)).not.toBeInTheDocument();
  });

  test("Delete button removes item", async () => {
    renderApp(<App />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText(/what needs to be done\?/i);
    await user.type(input, "to be deleted{enter}");

    const row = screen.getByText(/^to be deleted$/i).closest("li")!;
    const delBtn = within(row).getByRole("button", { name: /delete todo/i });
    await user.click(delBtn);

    expect(screen.queryByText(/^to be deleted$/i)).not.toBeInTheDocument();
  });
});
