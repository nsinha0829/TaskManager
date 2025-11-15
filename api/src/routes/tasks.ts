import { Hono } from "hono";

const tasksRoute = new Hono();

type TaskType = {
  id: number;
  content: string;
  date: number;
};

// Sample posts data
const tasks: TaskType[] = [
  {
    id: 1,
    content: "Do only what only you can do.",
    date: Date.parse("2024-06-24T12:00:00Z"),
  },
  {
    id: 2,
    content:
      "Elegance is not a dispensable luxury but a factor that decides between success and failure.",
    date: Date.parse("2024-06-25T12:00:00Z"),
  },
  {
    id: 3,
    content:
      "The question of whether computers can think is like the question of whether submarines can swim.",
    date: Date.parse("2024-06-26T12:00:00Z"),
  },
];

let nextId = 4;

// Read all posts
tasksRoute.get("/tasks", (c) => {
  return c.json(tasks);
});

// Read a specific post
tasksRoute.get("/tasks/:id", (c) => {
  const id = parseInt(c.req.param("id"));
  const task = tasks.find((p) => p.id === id);
  if (task) {
    return c.json(task);
  }
  return c.json({ error: "Post not found" }, 404);
});

// Delete a post
tasksRoute.delete("/tasks/:id", (c) => {
  const id = parseInt(c.req.param("id"));
  const taskIndex = tasks.findIndex((p) => p.id === id);
  if (taskIndex !== -1) {
    const deletedTask = tasks.splice(taskIndex, 1)[0];
    return c.json(deletedTask);
  }
  return c.json({ error: "Post not found" }, 404);
});

// Create a new post
tasksRoute.post("/tasks", async (c) => {
  const { content } = await c.req.json();
  const newTask = {
    id: nextId++,
    content,
    date: new Date().getTime(),
  };
  tasks.push(newTask);
  return c.json(newTask, 201);
});

// Update a post
tasksRoute.patch("/tasks/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const { content } = await c.req.json();
  const taskIndex = tasks.findIndex((p) => p.id === id);
  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], content };
    return c.json(tasks[taskIndex]);
  }
  return c.json({ error: "Post not found" }, 404);
});

export default tasksRoute;