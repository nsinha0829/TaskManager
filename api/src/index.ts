import { Hono } from "hono";
import { serve } from "@hono/node-server";
import assignments from "./routes/assignments";
import { cors } from "hono/cors";

const app = new Hono();

const allowedOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";

app.use(
  "*",
  cors({
    origin: allowedOrigin,
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"]
  })
);

app.get("/", (c) => c.text("Assignment Tracker API"));

app.route("/assignments", assignments);

const port = Number(process.env.PORT) || 3000;

serve(
  {
    fetch: app.fetch,
    port,
    hostname: "0.0.0.0"
  },
  (info) => {
    console.log(`API listening on http://0.0.0.0:${info.port}`);
  }
);
