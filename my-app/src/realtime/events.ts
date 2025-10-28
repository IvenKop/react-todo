export const EV = {
  connect: "connect",
  disconnect: "disconnect",
  hello: "hello",
  todos: {
    invalidate: "todos:invalidate",
  },
  todo: {
    created: "todo:created",
    updated: "todo:updated",
    removed: "todo:removed",
  },
  ping: "ping",
} as const;
