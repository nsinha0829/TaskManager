import React, { useEffect, useState } from "react";
import { useToast } from "./toast/ToastContext";
import { useSubjects } from "./hooks/useSubjects";
import { useAssignments } from "./hooks/useAssignments";

import { SidebarNav, TabKey } from "./components/SidebarNav";
import { MainPanel } from "./components/MainPanel";
import { CongratsOverlay } from "./components/CongratsOverlay";
import { AssignmentForm } from "./components/AssignmentForm";
import type { Subject } from "./components/SubjectForm";

const App: React.FC = () => {
  const { showToast } = useToast();

  const [tab, setTab] = useState<TabKey>("assignments");
  const [showForm, setShowForm] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  const [subjectFilter, setSubjectFilter] = useState("");
  const [sortBy, setSortBy] = useState<"dueDate" | "subject">("dueDate");

  const { subjects, setSubjects, addSubject, deleteSubject } = useSubjects();

  const {
    assignments,
    loading,
    reload,
    createAssignment,
    deleteAssignment
  } = useAssignments({
    subjectFilter,
    sortBy,
    onError: (msg) => showToast(msg, "error")
  });

  useEffect(() => {
    if (subjects.length === 0 && assignments.length > 0) {
      const map = new Map<string, string>();
      for (const a of assignments) {
        if (!map.has(a.subject)) map.set(a.subject, a.color || "#60a5fa");
      }
      const initial = Array.from(map.entries())
        .map(([name, color]) => ({ name, color }))
        .sort((a, b) => a.name.localeCompare(b.name));
      setSubjects(initial);
    }
  }, [assignments]);

  function handleAddSubject(s: Subject) {
    const result = addSubject(s);
    if (!result.ok) {
      showToast(result.reason, "info");
      return;
    }
    showToast("Subject added ✨", "success");
  }

  function handleDeleteSubject(name: string) {
    const hasAssignmentsWithSubject = assignments.some((a) => a.subject === name);
    if (hasAssignmentsWithSubject) {
      showToast("Delete or move assignments with this subject before removing it.", "error");
      return;
    }
    deleteSubject(name);
    showToast("Subject deleted 🗑️", "success");
  }

  async function handleCreateAssignment(input: {
    title: string;
    subject: string;
    dueDate: string;
    color: string;
    subtasks?: string[];
  }) {
    try {
      await createAssignment(input);
      showToast("Assignment added! ✨", "success");
      setShowForm(false);
      setTab("assignments");
      await reload();
    } catch (err: any) {
      console.error(err);
      showToast(err.message ?? "Error creating assignment", "error");
    }
  }

  async function handleDeleteAssignment(id: number) {
    try {
      await deleteAssignment(id);
      showToast("Assignment marked done ✅", "success");
      setShowCongrats(true);
    } catch (err: any) {
      console.error(err);
      showToast(err.message ?? "Error deleting assignment", "error");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #e0f2fe, #f9fafb)",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <header
        style={{
          padding: "1rem 1.5rem",
          borderBottom: "1px solid #e5e7eb",
          backgroundColor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)"
        }}
      >
        <h1 style={{ margin: 0, textAlign: "center", fontSize: "2rem", letterSpacing: "0.03em" }}>
        💙 Task Manager 💙
        </h1>
        <p style={{ margin: 0, marginTop: "0.25rem", textAlign: "center", color: "#6b7280", fontSize: "0.95rem" }}>
          I love you so much baby :)
        </p>
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          gap: "1.25rem",
          maxWidth: "1200px",
          width: "100%",
          margin: "1.25rem auto",
          padding: "0 1.25rem",
          alignItems: "stretch"
        }}
      >
        <SidebarNav
          tab={tab}
          setTab={setTab}
          assignmentCount={assignments.length}
          subjectsCount={subjects.length}
          onAddAssignment={() => setShowForm(true)}
        />

        <MainPanel
          tab={tab}
          loading={loading}
          assignments={assignments}
          subjects={subjects}
          subjectFilter={subjectFilter}
          setSubjectFilter={setSubjectFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onDeleteAssignment={handleDeleteAssignment}
          onAddSubject={handleAddSubject}
          onDeleteSubject={handleDeleteSubject}
        />
      </main>

      {/* Add Assignment modal */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50
          }}
          onClick={() => setShowForm(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "1.5rem",
              padding: "1.5rem 1.75rem",
              boxShadow: "0 16px 40px rgba(15, 23, 42, 0.35)",
              maxWidth: "420px",
              width: "100%",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                position: "absolute",
                top: "0.6rem",
                right: "0.7rem",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "1.3rem",
                lineHeight: 1,
                color: "#9ca3af"
              }}
            >
              ×
            </button>

            <AssignmentForm subjects={subjects} onCreate={handleCreateAssignment} />
          </div>
        </div>
      )}

      <CongratsOverlay open={showCongrats} onClose={() => setShowCongrats(false)} />
    </div>
  );
};

export default App;