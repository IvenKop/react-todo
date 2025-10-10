import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "../pages/LoginPage";
import { renderApp } from "./renderApp";

describe("Login — show/hide password", () => {
  test("click on 'Show password' toggles input type to text", async () => {
    renderApp(<LoginPage />);
    const user = userEvent.setup();

    const pwd = screen.getByLabelText(/^password$/i, { selector: "input" });
    expect(pwd).toHaveAttribute("type", "password");

    const toggle = screen.getByRole("button", { name: /show password/i });
    await user.click(toggle);

    expect(pwd).toHaveAttribute("type", "text");
  });
});
