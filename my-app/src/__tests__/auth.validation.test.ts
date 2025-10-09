import { loginSchema } from "../validation/auth";

describe("loginSchema", () => {
  it("accepts valid email & strong password", () => {
    const ok = { email: "user@example.com", password: "Aa1!abcd" };
    expect(() => loginSchema.parse(ok)).not.toThrow();
  });

  it("rejects invalid email", () => {
    const bad = { email: "wrong@", password: "Aa1!abcd" };
    expect(() => loginSchema.parse(bad)).toThrow();
  });

  it("rejects weak password (no uppercase)", () => {
    const bad = { email: "u@e.com", password: "aa1!abcd" };
    expect(() => loginSchema.parse(bad)).toThrow();
  });

  it("rejects short password", () => {
    const bad = { email: "u@e.com", password: "Aa1!a" };
    expect(() => loginSchema.parse(bad)).toThrow();
  });
});
