import React, { useEffect, useState } from "react";
import type { Assignment } from "./types";
import { AssignmentForm } from "./components/AssignmentForm";
import { AssignmentList } from "./components/AssignmentList";
import { AssignmentCalendar } from "./components/AssignmentCalendar";
import { SubjectForm, Subject } from "./components/SubjectForm";
import { useToast } from "./toast/ToastContext";

const API_BASE = "http://localhost:3000";
const SUBJECTS_STORAGE_KEY = "assignment_bubbler_subjects";

const App: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectFilter, setSubjectFilter] = useState("");
  const [sortBy, setSortBy] = useState<"dueDate" | "subject">("dueDate");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false); // 🎉 new

  const { showToast } = useToast();

  // Load subjects from localStorage on first mount
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SUBJECTS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Subject[];
        setSubjects(parsed);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  function saveSubjects(next: Subject[]) {
    setSubjects(next);
    try {
      window.localStorage.setItem(SUBJECTS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  async function loadAssignments() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (subjectFilter) params.set("subject", subjectFilter);
      if (sortBy) params.set("sortBy", sortBy);
      const res = await fetch(`${API_BASE}/assignments?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load assignments");
      const data = (await res.json()) as Assignment[];
      setAssignments(data);

      // If we have no subjects stored at all but have assignments, seed from them
      if (subjects.length === 0 && data.length > 0) {
        const map = new Map<string, string>();
        for (const a of data) {
          if (!map.has(a.subject)) {
            map.set(a.subject, a.color || "#60a5fa");
          }
        }
        const initialSubjects: Subject[] = Array.from(map.entries())
          .map(([name, color]) => ({ name, color }))
          .sort((a, b) => a.name.localeCompare(b.name));
        saveSubjects(initialSubjects);
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message ?? "Error loading assignments", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectFilter, sortBy]);

  function handleAddSubject(newSubject: Subject) {
    if (
      subjects.some(
        (s) => s.name.toLowerCase() === newSubject.name.toLowerCase()
      )
    ) {
      showToast("Subject already exists", "info");
      return;
    }
    const next = [...subjects, newSubject].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    saveSubjects(next);
    showToast("Subject added ✨", "success");
  }

  function handleDeleteSubject(name: string) {
    const hasAssignmentsWithSubject = assignments.some(
      (a) => a.subject === name
    );
    if (hasAssignmentsWithSubject) {
      showToast(
        "Delete or move assignments with this subject before removing it.",
        "error"
      );
      return;
    }
    const next = subjects.filter((s) => s.name !== name);
    saveSubjects(next);
    showToast("Subject deleted 🗑️", "success");
  }

  async function handleCreate(input: {
    title: string;
    subject: string;
    dueDate: string;
    color: string;
  }) {
    try {
      const res = await fetch(`${API_BASE}/assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(input)
      });
      if (!res.ok) {
        let message = "Failed to create assignment";
        try {
          const data = await res.json();
          if (data?.error) message = data.error;
        } catch {
          // ignore JSON error
        }
        throw new Error(message);
      }
      showToast("Assignment added! ✨", "success");
      await loadAssignments();
      setShowForm(false);
    } catch (err: any) {
      console.error(err);
      showToast(err.message ?? "Error creating assignment", "error");
    }
  }

  // ✅ Checkbox deletes assignment AND shows a "Great work!" screen
  async function handleDeleteAssignment(id: number) {
    try {
      const res = await fetch(`${API_BASE}/assignments/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) {
        let message = "Failed to delete assignment";
        try {
          const data = await res.json();
          if (data?.error) message = data.error;
        } catch {
          // ignore JSON error
        }
        throw new Error(message);
      }
      setAssignments((prev) => prev.filter((a) => a.id !== id));
      showToast("Assignment marked done ✅", "success");
      setShowCongrats(true); // 🎉 show celebration overlay
    } catch (err: any) {
      console.error(err);
      showToast(err.message ?? "Error deleting assignment", "error");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        background: "radial-gradient(circle at top, #e0f2fe, #f9fafb)"
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
        <h1
          style={{
            margin: 0,
            textAlign: "center",
            fontSize: "2rem",
            letterSpacing: "0.03em"
          }}
        >
          ✏️ Assignment Bubbler
        </h1>
        <p
          style={{
            margin: 0,
            marginTop: "0.25rem",
            textAlign: "center",
            color: "#6b7280",
            fontSize: "0.95rem"
          }}
        >
          Track your tasks by subject, with colors and cozy vibes.
        </p>
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          maxWidth: "1250px",
          width: "100%",
          margin: "1.5rem auto",
          padding: "0 1.5rem",
          gap: "1.75rem",
          alignItems: "flex-start"
        }}
      >
        {/* Sidebar */}
        <aside
          style={{
            width: "280px",
            minWidth: "260px",
            alignSelf: "stretch",
            borderRadius: "1.5rem",
            background: "white",
            boxShadow: "0 10px 30px rgba(148, 163, 184, 0.35)",
            padding: "1.25rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div
            style={{
              width: "100%"
            }}
          >
            <div
              style={{
                textAlign: "center",
                marginBottom: "1rem"
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.25rem"
                }}
              >
                Dashboard
              </h2>
              <p
                style={{
                  margin: 0,
                  marginTop: "0.25rem",
                  fontSize: "0.85rem",
                  color: "#6b7280"
                }}
              >
                Total assignments:{" "}
                <span style={{ fontWeight: 700 }}>{assignments.length}</span>
              </p>
            </div>

            <SubjectForm
              subjects={subjects}
              onAddSubject={async (s) => handleAddSubject(s)}
              onDeleteSubject={async (name) => handleDeleteSubject(name)}
            />
          </div>

          <div
            style={{
              width: "100%",
              marginTop: "1.25rem"
            }}
          >
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="primary-button"
              style={{
                marginTop: "0.5rem",
                width: "100%"
              }}
            >
              <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>+</span>
              Add assignment
            </button>

            <div
              style={{
                marginTop: "1.0rem",
                fontSize: "0.8rem",
                color: "#9ca3af",
                textAlign: "center"
              }}
            >
              Tip: Create subjects for each class, then assign tasks to them.
            </div>
          </div>
        </aside>

        {/* Main list area */}
        <section
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start"
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "720px"
            }}
          >
            {loading && (
              <p
                style={{
                  textAlign: "center",
                  color: "#6b7280",
                  marginBottom: "0.75rem"
                }}
              >
                Loading assignments…
              </p>
            )}

            <AssignmentList
              assignments={assignments}
              subjectFilter={subjectFilter}
              onSubjectFilterChange={setSubjectFilter}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              onDelete={handleDeleteAssignment}
            />
          </div>
        </section>

        {/* Right-side calendar */}
        <aside
          style={{
            width: "340px",
            minWidth: "300px",
            display: "flex",
            justifyContent: "flex-start"
          }}
        >
          <AssignmentCalendar assignments={assignments} />
        </aside>
      </main>

      {/* Modal for Add Assignment */}
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
            <AssignmentForm subjects={subjects} onCreate={handleCreate} />
          </div>
        </div>
      )}

      {/* 🎉 Great work overlay */}
      {showCongrats && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "radial-gradient(circle at top, rgba(219, 234, 254, 0.95), rgba(15, 23, 42, 0.9))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 60,
            cursor: "pointer"
          }}
          onClick={() => setShowCongrats(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "2rem",
              padding: "2rem 2.5rem",
              boxShadow: "0 24px 60px rgba(15,23,42,0.65)",
              maxWidth: "420px",
              width: "90%",
              textAlign: "center",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                position: "absolute",
                inset: "-40px",
                pointerEvents: "none",
                backgroundImage:
                  "radial-gradient(circle at 10% 20%, rgba(96,165,250,0.18) 0, transparent 55%), radial-gradient(circle at 80% 10%, rgba(244,114,182,0.18) 0, transparent 55%), radial-gradient(circle at 50% 90%, rgba(74,222,128,0.18) 0, transparent 55%)"
              }}
            />

            <div
              style={{
                position: "relative"
              }}
            >
              <div
                style={{
                  fontSize: "2.4rem",
                  marginBottom: "0.4rem"
                }}
              >
                Yay!!!
              </div>
              <p
                style={{
                  margin: 0,
                  marginBottom: "0.9rem",
                  fontSize: "1rem",
                  color: "#4b5563"
                }}
              >
                You just checked off an assignment! I'm so proud of you :)
              </p>

              <button
                type="button"
                className="primary-button"
                style={{
                  margin: "0 auto",
                  padding: "0.6rem 1.4rem",
                  fontSize: "0.95rem"
                }}
                onClick={() => setShowCongrats(false)}
              >
                Back to assignments
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;