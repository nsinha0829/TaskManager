// api/src/db.ts

export type Subtask = {
  id: number;
  text: string;
  completed: number; // 0 or 1
};

export type Assignment = {
  id: number;
  title: string;
  subject: string;
  dueDate: string; // ISO string (yyyy-mm-dd)
  color: string;
  completed: number; // 0 or 1
  subtasks?: Subtask[];
};

let assignments: Assignment[] = [];
let nextId = 1;
let nextSubtaskId = 1;

function normalizeSubtasks(
  subtasks?: Array<string | Partial<Subtask>>
): Subtask[] {
  if (!Array.isArray(subtasks)) return [];

  return subtasks
    .map((subtask) => {
      if (typeof subtask === "string") {
        const text = subtask.trim();
        if (!text) return null;

        return {
          id: nextSubtaskId++,
          text,
          completed: 0
        };
      }

      const text = typeof subtask.text === "string" ? subtask.text.trim() : "";
      if (!text) return null;

      return {
        id: typeof subtask.id === "number" ? subtask.id : nextSubtaskId++,
        text,
        completed: subtask.completed === 1 ? 1 : 0
      };
    })
    .filter((subtask): subtask is Subtask => subtask !== null);
}

export function getAllAssignments(
  subject?: string,
  sortBy: "dueDate" | "subject" = "dueDate",
  order: "asc" | "desc" = "asc"
): Assignment[] {
  let result = [...assignments];

  if (subject && subject.trim() !== "") {
    result = result.filter((a) => a.subject === subject);
  }

  result.sort((a, b) => {
    let cmp = 0;

    if (sortBy === "dueDate") {
      cmp = a.dueDate.localeCompare(b.dueDate);
    } else if (sortBy === "subject") {
      cmp = a.subject.localeCompare(b.subject);
    }

    return order === "asc" ? cmp : -cmp;
  });

  return result;
}

export function createAssignment(input: {
  title: string;
  subject: string;
  dueDate: string;
  color: string;
  subtasks?: Array<string | Partial<Subtask>>;
}): Assignment {
  const assignment: Assignment = {
    id: nextId++,
    title: input.title,
    subject: input.subject,
    dueDate: input.dueDate,
    color: input.color,
    completed: 0,
    subtasks: normalizeSubtasks(input.subtasks)
  };

  assignments.push(assignment);
  return assignment;
}

export function updateAssignment(
  id: number,
  fields: Partial<Omit<Assignment, "id">>
): Assignment | null {
  const idx = assignments.findIndex((a) => a.id === id);
  if (idx === -1) return null;

  const updated: Assignment = {
    ...assignments[idx],
    ...fields,
    subtasks: fields.subtasks
      ? normalizeSubtasks(fields.subtasks)
      : assignments[idx].subtasks
  };

  assignments[idx] = updated;
  return updated;
}

export function deleteAssignment(id: number): boolean {
  const before = assignments.length;
  assignments = assignments.filter((a) => a.id !== id);
  return assignments.length < before;
}