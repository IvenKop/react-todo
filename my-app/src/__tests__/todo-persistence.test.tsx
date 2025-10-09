import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { vi } from "vitest";
import { renderApp } from "./renderApp";

describe("Todo — persistence via localStorage", () => {
  test("restores list after re-render (using mocked getItem)", async () => {
    const user = userEvent.setup();
    const setSpy = vi.spyOn(Storage.prototype, "setItem");

    const { unmount } = renderApp(<App />);
    const input = screen.getByPlaceholderText(/what needs to be done\?/i);

    await user.type(input, "persist A{enter}");
    await user.type(input, "persist B{enter}");

    const lastCall = setSpy.mock.calls.at(-1);
    expect(lastCall).toBeTruthy();
    const [savedKey, savedValue] = lastCall as [string, string];

    unmount();

    const getSpy = vi
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation((k: string) => (k === savedKey ? savedValue : null));

    renderApp(<App />);

    expect(screen.getByText(/^persist A$/i)).toBeInTheDocument();
    expect(screen.getByText(/^persist B$/i)).toBeInTheDocument();

    getSpy.mockRestore();
    setSpy.mockRestore();
  });
});
