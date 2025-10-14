import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import LoginPage from "../pages/LoginPage";
import { TestProviders } from "../test-utils";

const mockLogin = vi.fn();
vi.mock("../hooks/useAuth", () => ({
  useAuth: () => ({ login: mockLogin }),
}));

test("submits with strong password", async () => {
  render(<LoginPage />, { wrapper: TestProviders });
  const user = userEvent.setup();

  +(await user.type(
    screen.getByPlaceholderText(/you@example\.com/i),
    "user@mail.com",
  ));
  await user.type(screen.getByLabelText(/^password$/i), "Aa1!abcd");
  await user.click(screen.getByRole("button", { name: /continue/i }));

  expect(mockLogin).toHaveBeenCalledTimes(1);
});
