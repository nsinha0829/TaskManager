import React from "react";
import type { Assignment } from "../types";

type Props = {
  assignments: Assignment[];
  subjectFilter: string;
  onSubjectFilterChange: (subject: string) => void;
  sortBy: "dueDate" | "subject";
  onSortByChange: (sortBy: "dueDate" | "subject") => void;
  onDelete: (id: number) => void; // checkbox will delete
};

export const AssignmentList: React.FC<Props> = ({
  assignments,
  subjectFilter,
  onSubjectFilterChange,
  sortBy,
  onSortByChange,
  onDelete
}) => {
  const subjects = Array.from(
    new Set(assignments.map((a) => a.subject))
  ).sort();

  return (
    <div style={{ flex: 1, padding: "1rem 0" }}>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1rem",
          alignItems: "center"
        }}
      >
        <h2 style={{ margin: 0 }}>Assignments</h2>
        <span style={{ color: "#555", fontSize: "0.9rem" }}>
          Total: {assignments.length}
        </span>

        <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
          <label style={{ fontSize: "0.85rem" }}>
            Filter by subject:{" "}
            <select
              value={subjectFilter}
              onChange={(e) => onSubjectFilterChange(e.target.value)}
              style={{
                padding: "0.25rem 0.4rem",
                borderRadius: "999px",
                border: "1px solid #e5e7eb",
                fontSize: "0.85rem"
              }}
            >
              <option value="">All</option>
              {subjects.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </label>

          <label style={{ fontSize: "0.85rem" }}>
            Sort by:{" "}
            <select
              value={sortBy}
              onChange={(e) =>
                onSortByChange(e.target.value as "dueDate" | "subject")
              }
              style={{
                padding: "0.25rem 0.4rem",
                borderRadius: "999px",
                border: "1px solid #e5e7eb",
                fontSize: "0.85rem"
              }}
            >
              <option value="dueDate">Due date</option>
              <option value="subject">Subject</option>
            </select>
          </label>
        </div>
      </div>

      {assignments.length === 0 ? (
        <p style={{ color: "#666", textAlign: "center", marginTop: "1rem" }}>
          No assignments yet.
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {assignments.map((a) => (
            <li
              key={a.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "0.75rem",
                padding: "0.75rem 1rem",
                marginBottom: "0.6rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                backgroundColor: a.color + "22",
                boxShadow: "0 2px 6px rgba(148, 163, 184, 0.25)"
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
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                    marginBottom: "0.15rem"
                  }}
                >
                  <strong>{a.title}</strong>
                  <span
                    style={{
                      padding: "0.1rem 0.45rem",
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                      backgroundColor: "#eef2ff",
                      color: "#3730a3"
                    }}
                  >
                    {a.subject}
                  </span>
                </div>

                <div style={{ fontSize: "0.85rem", color: "#555" }}>
                  Due: {a.dueDate}
                </div>

                {a.subtasks && a.subtasks.length > 0 && (
                  <ul
                    style={{
                      margin: "0.3rem 0 0",
                      paddingLeft: "1.1rem",
                      fontSize: "0.78rem",
                      fontStyle: "italic",
                      color: "#6b7280"
                    }}
                  >
                    {a.subtasks.map((subtask, index) => (
                      <li key={index}>{subtask}</li>
                    ))}
                  </ul>
                )}
              </div>

              <label
                style={{
                  fontSize: "0.8rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  color: "#6b7280"
                }}
              >
                <input
                  type="checkbox"
                  onChange={() => onDelete(a.id)}
                  style={{ cursor: "pointer" }}
                  title="Check to mark done & delete"
                />
                Done
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};