import { buildPages } from "../components/Pagination";

const p = (v: number) => ({ type: "page", value: v } as const);
const d = () => ({ type: "divider" } as const);

describe("buildPages", () => {
  it("short list", () => {
    expect(buildPages(1, 5)).toEqual([p(1), p(2), p(3), p(4), p(5)]);
  });

  it("at the start", () => {
    expect(buildPages(2, 10)).toEqual([p(1), p(2), p(3), d(), p(10)]);
  });

  it("middle", () => {
    expect(buildPages(5, 10)).toEqual([p(1), d(), p(4), p(5), p(6), d(), p(10)]);
  });

  it("at the end", () => {
    expect(buildPages(9, 10)).toEqual([p(1), d(), p(8), p(9), p(10)]);
  });
});
