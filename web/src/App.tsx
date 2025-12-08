// web/src/App.tsx
import React, { useEffect, useState } from "react";
import type { Assignment } from "./types";
import { AssignmentForm } from "./components/AssignmentForm";
import { AssignmentList } from "./components/AssignmentList";
import { useToast } from "./toast/ToastContext";

const API_BASE = "http://localhost:3000";

const App: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [subjectFilter, setSubjectFilter] = useState("");
  const [sortBy, setSortBy] = useState<"dueDate" | "subject">("dueDate");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const { showToast } = useToast();

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
    } catch (err: any) {
      console.error(err);
      showToast(err.message ?? "Error loading assignments", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAssignments();
  }, [subjectFilter, sortBy]);

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

  async function handleToggleComplete(id: number, completed: boolean) {
    try {
      const res = await fetch(`${API_BASE}/assignments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ completed: completed ? 1 : 0 })
      });
      if (!res.ok) {
        let message = "Failed to update assignment";
        try {
          const data = await res.json();
          if (data?.error) message = data.error;
        } catch {
          // ignore JSON error
        }
        throw new Error(message);
      }

      setAssignments((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, completed: completed ? 1 : 0 } : a
        )
      );
      showToast("Assignment updated ✅", "success");
    } catch (err: any) {
      console.error(err);
      showToast(err.message ?? "Error updating assignment", "error");
    }
  }

  async function handleDelete(id: number) {
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
      showToast("Assignment deleted 🗑️", "success");
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
          Assignment Tracker
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
          I love you baby :)
        </p>
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          maxWidth: "1100px",
          width: "100%",
          margin: "1.5rem auto",
          padding: "0 1.5rem",
          gap: "1.5rem"
        }}
      >
        {/* Sidebar */}
        <aside
          style={{
            width: "240px",
            minWidth: "220px",
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

                  <button
                      type="button"
                      onClick={() => setShowForm(true)}
                      style={{
                          marginTop: "1rem",
                          padding: "0.7rem 1rem",
                          borderRadius: "999px",
                          border: "none",
                          cursor: "pointer",
                          width: "100%",
                          background: "#1e3a8a", // dark blue
                          color: "white",
                          fontWeight: 700,
                          fontSize: "0.95rem",
                          boxShadow: "0 6px 16px rgba(30, 58, 138, 0.35)",
                          display: "flex",
                          gap: "0.5rem",
                          alignItems: "center",
                          justifyContent: "center"
                      }}
                  >
                      <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>+</span>
                      Add assignment
                  </button>
          <div
            style={{
              marginTop: "1.5rem",
              fontSize: "0.8rem",
              color: "#9ca3af",
              textAlign: "center"
            }}
          >
            Tip: Use colors to group by class or urgency!
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
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
            />
          </div>
        </section>
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
            <AssignmentForm onCreate={handleCreate} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;