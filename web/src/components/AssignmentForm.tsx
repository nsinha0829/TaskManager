// web/src/components/AssignmentForm.tsx
import React, { useState } from "react";

type Props = {
  onCreate: (input: {
    title: string;
    subject: string;
    dueDate: string;
    color: string;
  }) => Promise<void>;
};

const defaultColors = [
  "#f97373", // red-ish
  "#facc15", // yellow-ish
  "#4ade80", // green-ish
  "#60a5fa", // blue-ish
  "#a78bfa"  // purple-ish
];

export const AssignmentForm: React.FC<Props> = ({ onCreate }) => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [color, setColor] = useState(defaultColors[0]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !subject || !dueDate) return;
    setLoading(true);
    try {
      await onCreate({ title, subject, dueDate, color });
      setTitle("");
      setSubject("");
      setDueDate("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        padding: "0.5rem",
        maxWidth: "380px"
      }}
    >
      <h2
        style={{
          margin: 0,
          marginBottom: "0.5rem",
          textAlign: "center",
          fontSize: "1.4rem"
        }}
      >
        Add Assignment
      </h2>

      <label style={{ fontSize: "0.9rem" }}>
        Title
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
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
        Due date
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
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
        Color
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginTop: "0.25rem",
            alignItems: "center",
            flexWrap: "wrap"
          }}
        >
          {defaultColors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "999px",
                border: c === color ? "2px solid #0f172a" : "1px solid #d4d4d8",
                backgroundColor: c,
                cursor: "pointer"
              }}
            />
          ))}
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ marginLeft: "0.25rem", borderRadius: "999px" }}
          />
        </div>
      </label>

      <button
  type="submit"
  disabled={loading}
  style={{
    marginTop: "0.5rem",
    padding: "0.5rem 0.75rem",
    borderRadius: "999px",
    border: "none",
    cursor: "pointer",
    background: "#1e3a8a", // dark blue
    color: "white",
    fontWeight: 600,
    fontSize: "0.95rem",
    boxShadow: "0 4px 12px rgba(30, 58, 138, 0.35)"
  }}
>
  {loading ? "Adding..." : "Add Assignment"}
</button>

    </form>
  );
};