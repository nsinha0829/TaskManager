import React from "react";
import type { Assignment } from "../types";
import type { Subject } from "./SubjectForm";
import { AssignmentList } from "./AssignmentList";
import { SubjectForm } from "./SubjectForm";

type Props = {
  tab: "assignments" | "subjects";
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
  return (
    <section
      style={{
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.95)",
        borderRadius: "1.5rem",
        padding: "1rem 1.25rem",
        boxShadow: "0 10px 30px rgba(148, 163, 184, 0.35)",
        border: "1px solid #e5e7eb",
        minHeight: "70vh"
      }}
    >
      {tab === "assignments" && (
        <>
          {loading && (
            <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
              Loading assignments...
            </p>
          )}

          <AssignmentList
            assignments={assignments}
            subjectFilter={subjectFilter}
            onSubjectFilterChange={setSubjectFilter}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            onDelete={onDeleteAssignment}
            onToggleSubtask={onToggleSubtask}
          />
        </>
      )}

      {tab === "subjects" && (
        <SubjectForm
          subjects={subjects}
          onAddSubject={onAddSubject}
          onDeleteSubject={onDeleteSubject}
        />
      )}
    </section>
  );
};