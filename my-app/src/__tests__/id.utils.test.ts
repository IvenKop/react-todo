import { genId } from "../utils/id";

describe("id util", () => {
  it("returns unique non-empty string", () => {
    const a = genId();
    const b = genId();
    expect(typeof a).toBe("string");
    expect(a).not.toHaveLength(0);
    expect(a).not.toBe(b);
  });
});
