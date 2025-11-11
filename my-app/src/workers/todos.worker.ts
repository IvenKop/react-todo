import type { Todo } from "../types";

type TodoWorkerRequest =
  | { type: "stats"; todos: Todo[] }
  | { type: "exportCsv"; todos: Todo[] };

type TodoStats = {
  total: number;
  active: number;
  completed: number;
};

type TodoWorkerResponse =
  | { type: "stats"; stats: TodoStats }
  | { type: "exportCsv"; csv: string };

const ctx: any = self as any;

ctx.onmessage = (event: MessageEvent<TodoWorkerRequest>) => {
  const data = event.data;
  if (!data) return;

  if (data.type === "stats") {
    const todos = data.todos || [];
    const total = todos.length;
    const completed = todos.reduce((acc, t) => acc + (t.completed ? 1 : 0), 0);
    const active = total - completed;
    const stats: TodoStats = { total, active, completed };
    const message: TodoWorkerResponse = { type: "stats", stats };
    ctx.postMessage(message);
  }

  if (data.type === "exportCsv") {
    const todos = data.todos || [];
    const lines: string[] = ["id,text,completed"];
    for (let i = 0; i < todos.length; i++) {
      const todo = todos[i];
      const text = String(todo.text).replace(/"/g, '""');
      const completed = todo.completed ? "true" : "false";
      lines.push(`${todo.id},"${text}",${completed}`);
    }
    const csv = lines.join("\n");
    const message: TodoWorkerResponse = { type: "exportCsv", csv };
    ctx.postMessage(message);
  }
};
