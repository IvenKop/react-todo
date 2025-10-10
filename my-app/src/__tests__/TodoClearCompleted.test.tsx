import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { renderApp } from "./renderApp";

describe("Todo — Clear completed", () => {
  test("clears all completed items", async () => {
    renderApp(<App />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText(/what needs to be done\?/i);
    await user.type(input, "first{enter}");
    await user.type(input, "second{enter}");

    const firstRow = screen.getByText(/^first$/i).closest("li")!;
    const secondRow = screen.getByText(/^second$/i).closest("li")!;

    await user.click(
      within(firstRow).getByRole("button", { name: /toggle completed/i }),
    );
    await user.click(
      within(secondRow).getByRole("button", { name: /toggle completed/i }),
    );

    await user.click(screen.getByRole("button", { name: /clear completed/i }));

    expect(screen.queryByText(/^first$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^second$/i)).not.toBeInTheDocument();
  });
});
