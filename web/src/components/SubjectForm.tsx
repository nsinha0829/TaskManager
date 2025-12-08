// web/src/components/SubjectForm.tsx
import React, { useState } from "react";

export type Subject = {
  name: string;
  color: string;
};

type SubjectFormProps = {
  subjects: Subject[];
  onAddSubject: (subject: Subject) => void;
  onDeleteSubject: (name: string) => void;
};

const defaultColors = [
  "#f97373", // red-ish
  "#facc15", // yellow-ish
  "#4ade80", // green-ish
  "#60a5fa", // blue-ish
  "#a78bfa"  // purple-ish
];

export const SubjectForm: React.FC<SubjectFormProps> = ({
  subjects,
  onAddSubject,
  onDeleteSubject
}) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState(defaultColors[0]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    onAddSubject({ name: trimmed, color });
    setName("");
  }

  return (
    <div
      style={{
        width: "100%",
        marginTop: "0.5rem"
      }}
    >
      <h3
        style={{
          margin: 0,
          marginBottom: "0.35rem",
          fontSize: "1rem",
          textAlign: "center"
        }}
      >
        Subjects
      </h3>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.4rem",
          marginBottom: "0.6rem"
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add a subject (e.g. Fluids)"
          style={{
            width: "100%",
            padding: "0.35rem 0.55rem",
            borderRadius: "999px",
            border: "1px solid #e5e7eb",
            fontSize: "0.85rem"
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <span
            style={{
              fontSize: "0.8rem",
              color: "#6b7280",
              minWidth: "52px"
            }}
          >
            Color
          </span>
          <div
            style={{
              display: "flex",
              gap: "0.3rem",
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
                  width: "18px",
                  height: "18px",
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
              style={{
                borderRadius: "999px",
                width: "28px",
                height: "28px",
                padding: 0,
                border: "1px solid #d4d4d8"
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          className="primary-button"
          style={{
            padding: "0.35rem 0.65rem",
            fontSize: "0.8rem",
            boxShadow: "none",
            justifyContent: "center",
            marginTop: "0.2rem"
          }}
        >
          + Add subject
        </button>
      </form>

      {subjects.length > 0 ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.25rem",
            justifyContent: "center"
          }}
        >
          {subjects.map((subj) => (
            <span
              key={subj.name}
              style={{
                padding: "0.15rem 0.45rem",
                borderRadius: "999px",
                backgroundColor: subj.color + "22",
                border: `1px solid ${subj.color}`,
                fontSize: "0.75rem",
                color: "#0f172a",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem"
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "999px",
                  backgroundColor: subj.color
                }}
              />
              {subj.name}
              <button
                type="button"
                onClick={() => onDeleteSubject(subj.name)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  color: "#9ca3af",
                  padding: 0,
                  marginLeft: "0.1rem"
                }}
                title="Delete subject"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p
          style={{
            margin: 0,
            marginTop: "0.25rem",
            fontSize: "0.75rem",
            color: "#9ca3af",
            textAlign: "center"
          }}
        >
          No subjects yet — add one!
        </p>
      )}
    </div>
  );
};