import { Hono } from "hono";
import { serve } from "@hono/node-server";
import assignments from "./routes/assignments";
import { cors } from "hono/cors";

const app = new Hono();

// Proper CORS for your React dev server on 5173
app.use(
  "*",
  cors({
    origin: "http://localhost:5173",
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"]
  })
);

// Health check
app.get("/", (c) => c.text("Assignment Tracker API"));

// Mount routes
app.route("/assignments", assignments);

const port = 3000;

serve({
  fetch: app.fetch,
  port,
});

console.log(`API listening on http://localhost:${port}`);
