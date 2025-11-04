export const qk = {
  todos: (filter: string, page: number, limit: number) =>
    ["todos", filter, page, limit] as const,
};
