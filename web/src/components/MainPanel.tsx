import React, { useState } from "react";
import type { Assignment } from "../types";
import type { AssignmentUpdateInput } from "../hooks/useAssignments";
import type { Subject } from "./SubjectForm";
import { AssignmentCalendar } from "./AssignmentCalendar";
import { AssignmentList } from "./AssignmentList";
import { SubjectForm } from "./SubjectForm";
import type { TabKey } from "./SidebarNav";

type Props = {
  tab: TabKey;
  loading: boolean;
  assignments: Assignment[];
  subjects: Subject[];
  subjectFilter: string;
  setSubjectFilter: (subject: string) => void;
  sortBy: "dueDate" | "subject";
  setSortBy: (sortBy: "dueDate" | "subject") => void;
  onDeleteAssignment: (id: number) => void;
  onUpdateAssignment: (id: number, fields: AssignmentUpdateInput) => void;
  onToggleSubtask: (assignmentId: number, subtaskId: number) => void;
  onAddSubject: (subject: Subject) => void;
  onDeleteSubject: (name: string) => void;
};

export const MainPanel: React.FC<Props> = ({
  tab,
  loading,
  assignments,
  subjects,
  subjectFilter,
  setSubjectFilter,
  sortBy,
  setSortBy,
  onDeleteAssignment,
  onUpdateAssignment,
  onToggleSubtask,
  onAddSubject,
  onDeleteSubject
}) => {
  const [showSuggestionBox, setShowSuggestionBox] = useState(false);
  const [suggestionText, setSuggestionText] = useState("");

  const title =
    tab === "assignments"
      ? "Assignments"
      : tab === "calendar"
      ? "Calendar"
      : "Subjects";

  function handleSubmitSuggestion() {
    const subject = encodeURIComponent("Task Manager Suggestion");
    const body = encodeURIComponent(
      suggestionText.trim()
        ? suggestionText.trim()
        : "Suggestion for the Task Manager:"
    );

    window.location.href = `mailto:nitisinha0829@gmail.com?subject=${subject}&body=${body}`;
  }

  return (
    <section
      style={{
        flex: 1,
        borderRadius: "1.5rem",
        background: "white",
        boxShadow: "0 10px 30px rgba(148, 163, 184, 0.35)",
        padding: "1rem 1.25rem",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "0.75rem"
        }}
      >
        <h2 style={{ margin: 0 }}>{title}</h2>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem"
          }}
        >
          {loading && (
            <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>
              Loading…
            </span>
          )}

          <button
            type="button"
            onClick={() => setShowSuggestionBox((prev) => !prev)}
            style={{
              border: "1px solid #bfdbfe",
              backgroundColor: "#eff6ff",
              color: "#1d4ed8",
              borderRadius: "999px",
              padding: "0.35rem 0.75rem",
              cursor: "pointer",
              fontSize: "0.82rem",
              fontWeight: 700
            }}
          >
            Suggest a Change
          </button>
        </div>
      </div>

      {showSuggestionBox && (
        <div
          style={{
            border: "1px solid #dbeafe",
            backgroundColor: "#f8fafc",
            borderRadius: "1rem",
            padding: "0.75rem",
            marginBottom: "0.9rem"
          }}
        >
          <textarea
            value={suggestionText}
            onChange={(e) => setSuggestionText(e.target.value)}
            placeholder="Write your suggestion here..."
            style={{
              width: "100%",
              minHeight: "4.5rem",
              resize: "vertical",
              border: "1px solid #d4d4d8",
              borderRadius: "0.7rem",
              padding: "0.55rem 0.65rem",
              fontFamily: "inherit",
              fontSize: "0.9rem"
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.5rem",
              marginTop: "0.5rem"
            }}
          >
            <button
              type="button"
              onClick={() => {
                setShowSuggestionBox(false);
                setSuggestionText("");
              }}
              style={{
                border: "1px solid #e5e7eb",
                backgroundColor: "white",
                borderRadius: "999px",
                padding: "0.35rem 0.75rem",
                cursor: "pointer",
                fontSize: "0.82rem"
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmitSuggestion}
              style={{
                border: "none",
                backgroundColor: "#2563eb",
                color: "white",
                borderRadius: "999px",
                padding: "0.35rem 0.85rem",
                cursor: "pointer",
                fontSize: "0.82rem",
                fontWeight: 700
              }}
            >
              Email Suggestion
            </button>
          </div>
        </div>
      )}

      {tab === "assignments" && (
        <div style={{ flex: 1 }}>
          <AssignmentList
            assignments={assignments}
            subjects={subjects}
            subjectFilter={subjectFilter}
            onSubjectFilterChange={setSubjectFilter}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            onDelete={onDeleteAssignment}
            onUpdateAssignment={onUpdateAssignment}
            onToggleSubtask={onToggleSubtask}
          />
        </div>
      )}

      {tab === "calendar" && (
        <div
          style={{
            flex: 1,
            width: "100%",
            paddingTop: "0.5rem"
          }}
        >
          <AssignmentCalendar assignments={assignments} />
        </div>
      )}

      {tab === "subjects" && (
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            paddingTop: "0.5rem"
          }}
        >
          <div style={{ width: "100%", maxWidth: "520px" }}>
            <p style={{ marginTop: 0, color: "#6b7280" }}>
              Create subjects and pick a color. Assignments inherit the subject color.
            </p>

            <SubjectForm
              subjects={subjects}
              onAddSubject={onAddSubject}
              onDeleteSubject={onDeleteSubject}
            />
          </div>
        </div>
      )}
    </section>
  );
};