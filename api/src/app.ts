import { Hono } from "hono";
import tasksRoute from "./routes/tasks.js";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/", tasksRoute);

export default app;