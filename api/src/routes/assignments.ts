import { Hono } from "hono";
import {
  getAllAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from "../db";

const assignments = new Hono();

// GET /assignments?subject=&sortBy=&order=
assignments.get("/", (c) => {
  const url = new URL(c.req.url);
  const subject = url.searchParams.get("subject") || undefined;
  const sortBy =
    (url.searchParams.get("sortBy") as "dueDate" | "subject") || "dueDate";
  const order =
    (url.searchParams.get("order") as "asc" | "desc") || "asc";

  const data = getAllAssignments(subject, sortBy, order);
  return c.json(data);
});

// POST /assignments
assignments.post("/", async (c) => {
  const body = await c.req.json();
  const { title, subject, dueDate, color } = body;

  if (!title || !subject || !dueDate || !color) {
    return c.json({ error: "Missing fields" }, 400);
  }

  const created = createAssignment({ title, subject, dueDate, color });
  return c.json(created, 201);
});

// PATCH /assignments/:id
assignments.patch("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (Number.isNaN(id)) return c.json({ error: "Invalid id" }, 400);

  const body = await c.req.json();
  const updated = updateAssignment(id, body);

  if (!updated) return c.json({ error: "Not found" }, 404);
  return c.json(updated);
});

// DELETE /assignments/:id
assignments.delete("/:id", (c) => {
  const id = Number(c.req.param("id"));
  if (Number.isNaN(id)) return c.json({ error: "Invalid id" }, 400);

  const ok = deleteAssignment(id);
  if (!ok) return c.json({ error: "Not found" }, 404);

  return c.json({ success: true });
});

export default assignments;
