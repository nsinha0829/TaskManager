import React from "react";

export type TabKey = "assignments" | "calendar" | "subjects";

function NavButton(props: {
  active: boolean;
  label: string;
  emoji: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      style={{
        width: "100%",
        border: "none",
        cursor: "pointer",
        borderRadius: "1rem",
        padding: "0.75rem 0.9rem",
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        fontSize: "0.95rem",
        fontWeight: 600,
        backgroundColor: props.active ? "#0b3a83" : "transparent",
        color: props.active ? "white" : "#0f172a",
        boxShadow: props.active ? "0 10px 22px rgba(2, 6, 23, 0.22)" : "none",
        transition: "transform 120ms ease, box-shadow 120ms ease"
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0px)";
      }}
    >
      <span style={{ fontSize: "1.1rem" }}>{props.emoji}</span>
      {props.label}
    </button>
  );
}

export function SidebarNav(props: {
  tab: TabKey;
  setTab: (t: TabKey) => void;
  assignmentCount: number;
  subjectsCount: number;
  onAddAssignment: () => void;
}) {
  const { tab, setTab, assignmentCount, subjectsCount, onAddAssignment } = props;

  return (
    <aside
      style={{
        width: "250px",
        minWidth: "240px",
        borderRadius: "1.5rem",
        background: "white",
        boxShadow: "0 10px 30px rgba(148, 163, 184, 0.35)",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem"
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "0.25rem" }}>
        <div style={{ fontWeight: 800, color: "#0f172a" }}>Navigate</div>
        <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>
          {assignmentCount} assignments
        </div>
      </div>

      <NavButton
        active={tab === "assignments"}
        label="Assignments"
        emoji=""
        onClick={() => setTab("assignments")}
      />
      <NavButton
        active={tab === "calendar"}
        label="Calendar"
        emoji=""
        onClick={() => setTab("calendar")}
      />
      <NavButton
        active={tab === "subjects"}
        label="Subjects"
        emoji=""
        onClick={() => setTab("subjects")}
      />

      <div style={{ flex: 1 }} />

      <button
        type="button"
        className="primary-button"
        onClick={onAddAssignment}
        style={{ width: "100%", justifyContent: "center" }}
        disabled={subjectsCount === 0}
        title={subjectsCount === 0 ? "Add a subject first" : "Add an assignment"}
      >
        + Add assignment
      </button>

      {subjectsCount === 0 && (
        <div style={{ fontSize: "0.8rem", color: "#9ca3af", textAlign: "center" }}>
          Add a subject first in the Subjects tab.
        </div>
      )}
    </aside>
  );
}