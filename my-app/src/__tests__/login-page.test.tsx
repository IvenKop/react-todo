import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../test-utils";
import LoginPage from "../pages/LoginPage";
import { vi } from "vitest";

vi.mock("../hooks/useAuth", () => {
  return {
    useAuth: () => ({
      login: vi.fn(() => {
        localStorage.setItem("auth_token", "mock");
      }),
    }),
  };
});

describe("LoginPage", () => {
  it("marks fields invalid on empty submit", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />, { route: "/login" });

    await user.click(screen.getByRole("button", { name: /continue/i }));

    const email = screen.getByPlaceholderText(/you@example.com/i);
    const pass = screen.getByLabelText(/^password$/i);
    expect(email).toHaveAttribute("data-invalid", "true");
    expect(pass).toHaveAttribute("data-invalid", "true");
  });

  it("submits with strong password", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />, { route: "/login" });

    await user.type(screen.getByPlaceholderText(/you@example.com/i), "x@y.com");
    await user.type(screen.getByLabelText(/^password$/i), "Aa1!abcd");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(localStorage.getItem("auth_token")).toBe("mock");
  });
});
