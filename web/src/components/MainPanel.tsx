import React from "react";
import type { Assignment } from "../types";
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
  onToggleSubtask,
  onAddSubject,
  onDeleteSubject
}) => {
  const title =
    tab === "assignments"
      ? "Assignments"
      : tab === "calendar"
      ? "Calendar"
      : "Subjects";

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

        {loading && (
          <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>
            Loading…
          </span>
        )}
      </div>

      {tab === "assignments" && (
        <div style={{ flex: 1 }}>
          <AssignmentList
            assignments={assignments}
            subjectFilter={subjectFilter}
            onSubjectFilterChange={setSubjectFilter}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            onDelete={onDeleteAssignment}
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