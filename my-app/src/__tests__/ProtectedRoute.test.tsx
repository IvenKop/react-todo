import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import LoginPage from "../pages/LoginPage";
import { vi } from "vitest";

vi.mock("../hooks/useAuth", () => ({
  useAuth: () => ({ isAuthed: false }),
}));

describe("ProtectedRoute", () => {
  it("redirects to /login when not authed", async () => {
    render(
      <MemoryRouter initialEntries={["/private"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/private" element={<div>Private</div>} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText(/sign in/i)).toBeInTheDocument();
  });
});
