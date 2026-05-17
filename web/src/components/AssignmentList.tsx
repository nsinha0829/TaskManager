import React, { useState } from "react";
import type { Assignment } from "../types";
import type { AssignmentUpdateInput } from "../hooks/useAssignments";
import type { Subject } from "./SubjectForm";

type Props = {
  assignments: Assignment[];
  subjects: Subject[];
  subjectFilter: string;
  onSubjectFilterChange: (subject: string) => void;
  sortBy: "dueDate" | "subject";
  onSortByChange: (sortBy: "dueDate" | "subject") => void;
  onDelete: (id: number) => void;
  onUpdateAssignment: (id: number, fields: AssignmentUpdateInput) => void;
  onToggleSubtask: (assignmentId: number, subtaskId: number) => void;
};

function formatTime(time?: string) {
  if (!time) return "";

  const [hourString, minuteString] = time.split(":");
  const hour = Number(hourString);
  const minute = Number(minuteString);

  if (Number.isNaN(hour) || Number.isNaN(minute)) return time;

  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${String(minute).padStart(2, "0")} ${suffix}`;
}

export const AssignmentList: React.FC<Props> = ({
  assignments,
  subjects,
  subjectFilter,
  onSubjectFilterChange,
  sortBy,
  onSortByChange,
  onDelete,
  onUpdateAssignment,
  onToggleSubtask
}) => {
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editDueTime, setEditDueTime] = useState("");
  const [editSubtasks, setEditSubtasks] = useState("");

  const filterSubjects = Array.from(
    new Set(assignments.map((a) => a.subject))
  ).sort();

  function openEditModal(assignment: Assignment) {
    setEditingAssignment(assignment);
    setEditTitle(assignment.title);
    setEditSubject(assignment.subject);
    setEditDueDate(assignment.dueDate || "");
    setEditDueTime(assignment.dueTime || "");
    setEditSubtasks(
      assignment.subtasks?.map((subtask) => subtask.text).join("\n") || ""
    );
  }

  function closeEditModal() {
    setEditingAssignment(null);
    setEditTitle("");
    setEditSubject("");
    setEditDueDate("");
    setEditDueTime("");
    setEditSubtasks("");
  }

  function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();

    if (!editingAssignment || !editTitle.trim() || !editSubject) return;

    const selectedSubject = subjects.find((subject) => subject.name === editSubject);
    const oldSubtasks = editingAssignment.subtasks ?? [];
    const newSubtaskLines = editSubtasks
      .split("\n")
      .map((subtask) => subtask.trim())
      .filter(Boolean);

    const updatedSubtasks = newSubtaskLines.map((text, index) => {
      const oldSubtask = oldSubtasks[index];

      return {
        id: oldSubtask?.id ?? Date.now() + index,
        text,
        completed: oldSubtask?.completed ?? 0
      };
    });

    onUpdateAssignment(editingAssignment.id, {
      title: editTitle.trim(),
      subject: editSubject,
      dueDate: editDueDate,
      dueTime: editDueDate ? editDueTime : "",
      color: selectedSubject?.color ?? editingAssignment.color,
      subtasks: updatedSubtasks
    });

    closeEditModal();
  }

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

              {filterSubjects.map((subj) => (
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
              onDoubleClick={() => openEditModal(a)}
              title="Double click to edit"
              style={{
                border: "1px solid #ddd",
                borderRadius: "0.75rem",
                padding: "0.75rem 1rem",
                marginBottom: "0.6rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                backgroundColor: a.color + "22",
                boxShadow: "0 2px 6px rgba(148, 163, 184, 0.25)",
                cursor: "default"
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
                  Due: {a.dueDate || "No due date"}
                  {a.dueDate && a.dueTime ? ` at ${formatTime(a.dueTime)}` : ""}
                </div>

                {a.subtasks && a.subtasks.length > 0 && (
                  <ul
                    style={{
                      margin: "0.4rem 0 0",
                      paddingLeft: 0,
                      fontSize: "0.86rem",
                      fontStyle: "italic",
                      color: "#6b7280",
                      listStyle: "none"
                    }}
                  >
                    {a.subtasks.map((subtask) => (
                      <li
                        key={subtask.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          marginTop: "0.2rem"
                        }}
                        onDoubleClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={subtask.completed === 1}
                          onChange={() => onToggleSubtask(a.id, subtask.id)}
                          style={{
                            cursor: "pointer",
                            width: "0.85rem",
                            height: "0.85rem"
                          }}
                        />

                        <span
                          style={{
                            textDecoration:
                              subtask.completed === 1 ? "line-through" : "none",
                            opacity: subtask.completed === 1 ? 0.65 : 1
                          }}
                        >
                          {subtask.text}
                        </span>
                      </li>
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
                onDoubleClick={(e) => e.stopPropagation()}
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

      {editingAssignment && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 80
          }}
          onClick={closeEditModal}
        >
          <form
            onSubmit={handleSaveEdit}
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              borderRadius: "1.5rem",
              padding: "1.5rem 1.75rem",
              boxShadow: "0 16px 40px rgba(15, 23, 42, 0.35)",
              maxWidth: "430px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem"
            }}
          >
            <h2 style={{ margin: 0, textAlign: "center", fontSize: "1.35rem" }}>
              Edit Assignment
            </h2>

            <label style={{ fontSize: "0.9rem" }}>
              Title
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.4rem 0.6rem",
                  borderRadius: "0.6rem",
                  border: "1px solid #d4d4d8",
                  marginTop: "0.15rem"
                }}
              />
            </label>

            <label style={{ fontSize: "0.9rem" }}>
              Subject
              <select
                value={editSubject}
                onChange={(e) => setEditSubject(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.4rem 0.6rem",
                  borderRadius: "0.6rem",
                  border: "1px solid #d4d4d8",
                  marginTop: "0.15rem",
                  backgroundColor: "white"
                }}
              >
                {subjects.map((subject) => (
                  <option key={subject.name} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </label>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem"
              }}
            >
              <label style={{ fontSize: "0.9rem" }}>
                Due date
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.4rem 0.6rem",
                    borderRadius: "0.6rem",
                    border: "1px solid #d4d4d8",
                    marginTop: "0.15rem"
                  }}
                />
              </label>

              <label style={{ fontSize: "0.9rem" }}>
                Due time
                <input
                  type="time"
                  value={editDueTime}
                  onChange={(e) => setEditDueTime(e.target.value)}
                  disabled={!editDueDate}
                  style={{
                    width: "100%",
                    padding: "0.4rem 0.6rem",
                    borderRadius: "0.6rem",
                    border: "1px solid #d4d4d8",
                    marginTop: "0.15rem",
                    backgroundColor: editDueDate ? "white" : "#f3f4f6"
                  }}
                />
              </label>
            </div>

            <label style={{ fontSize: "0.9rem" }}>
              Subtasks
              <textarea
                value={editSubtasks}
                onChange={(e) => setEditSubtasks(e.target.value)}
                placeholder="One subtask per line"
                style={{
                  width: "100%",
                  padding: "0.4rem 0.6rem",
                  borderRadius: "0.6rem",
                  border: "1px solid #d4d4d8",
                  marginTop: "0.15rem",
                  minHeight: "4.5rem",
                  resize: "vertical"
                }}
              />
            </label>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.5rem",
                marginTop: "0.25rem"
              }}
            >
              <button
                type="button"
                onClick={closeEditModal}
                style={{
                  border: "1px solid #e5e7eb",
                  backgroundColor: "white",
                  borderRadius: "999px",
                  padding: "0.45rem 0.85rem",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                style={{
                  justifyContent: "center"
                }}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};