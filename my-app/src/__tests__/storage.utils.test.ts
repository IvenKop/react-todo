import * as storage from "../utils/storage";

describe("storage utils", () => {
  beforeEach(() => localStorage.clear());

  it("persists and reads todos", () => {
    const todos = [{ id: "1", text: "a", completed: false }];
    storage.saveTodos(todos);
    expect(storage.getTodos()).toEqual(todos);
  });

  it("persists and reads filter", () => {
    storage.saveFilter("active" as any);
    expect(storage.getFilter()).toBe("active");
  });
});
