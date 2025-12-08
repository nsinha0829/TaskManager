import React from "react";
import type { Assignment } from "../types";

type Props = {
  assignments: Assignment[];
  subjectFilter: string;
  onSubjectFilterChange: (subject: string) => void;
  sortBy: "dueDate" | "subject";
  onSortByChange: (sortBy: "dueDate" | "subject") => void;
  onToggleComplete: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
};

export const AssignmentList: React.FC<Props> = ({
  assignments,
  subjectFilter,
  onSubjectFilterChange,
  sortBy,
  onSortByChange,
  onToggleComplete,
  onDelete
}) => {
  const subjects = Array.from(
    new Set(assignments.map((a) => a.subject))
  ).sort();

  return (
    <div style={{ flex: 1, padding: "1rem" }}>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1rem",
          alignItems: "center"
        }}
      >
        <h2 style={{ margin: 0 }}>Assignments</h2>
        <span style={{ color: "#555" }}>
          Total: {assignments.length}
        </span>

        <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
          <label>
            Filter by subject:{" "}
            <select
              value={subjectFilter}
              onChange={(e) => onSubjectFilterChange(e.target.value)}
            >
              <option value="">All</option>
              {subjects.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </label>

          <label>
            Sort by:{" "}
            <select
              value={sortBy}
              onChange={(e) =>
                onSortByChange(e.target.value as "dueDate" | "subject")
              }
            >
              <option value="dueDate">Due date</option>
              <option value="subject">Subject</option>
            </select>
          </label>
        </div>
      </div>

      {assignments.length === 0 ? (
        <p style={{ color: "#666" }}>No assignments yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {assignments.map((a) => (
            <li
              key={a.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "0.5rem",
                padding: "0.75rem 1rem",
                marginBottom: "0.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                backgroundColor: a.color + "22" // transparent tint
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "100%",
                  backgroundColor: a.color,
                  borderRadius: "999px"
                }}
              />

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <strong
                    style={{
                      textDecoration:
                        a.completed ? "line-through" : "none"
                    }}
                  >
                    {a.title}
                  </strong>
                  <span
                    style={{
                      padding: "0.1rem 0.4rem",
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                      backgroundColor: "#eee"
                    }}
                  >
                    {a.subject}
                  </span>
                </div>
                <div style={{ fontSize: "0.85rem", color: "#555" }}>
                  Due: {a.dueDate}
                </div>
              </div>

              <label style={{ fontSize: "0.85rem" }}>
                <input
                  type="checkbox"
                  checked={!!a.completed}
                  onChange={(e) =>
                    onToggleComplete(a.id, e.target.checked)
                  }
                  style={{ marginRight: "0.25rem" }}
                />
                Done
              </label>

              <button
                onClick={() => onDelete(a.id)}
                style={{
                  border: "none",
                  background: "#fee2e2",
                  color: "#b91c1c",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "0.25rem",
                  cursor: "pointer"
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
