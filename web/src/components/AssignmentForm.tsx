import React, { useEffect, useMemo, useState } from "react";
import type { Subject } from "./SubjectForm";

type Props = {
  subjects: Subject[];
  onCreate: (input: {
    title: string;
    subject: string;
    dueDate: string;
    dueTime?: string;
    color: string;
    subtasks?: string[];
  }) => Promise<void>;
};

export const AssignmentForm: React.FC<Props> = ({
  subjects,
  onCreate
}) => {
  const [title, setTitle] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [subtasks, setSubtasks] = useState("");
  const [loading, setLoading] = useState(false);

  const hasSubjects = subjects.length > 0;

  // If nothing selected yet but there are subjects, default to the first one
  useEffect(() => {
    if (!subjectName && subjects.length > 0) {
      setSubjectName(subjects[0].name);
    }
  }, [subjects, subjectName]);

  const selectedSubject = useMemo(
    () => subjects.find((s) => s.name === subjectName),
    [subjects, subjectName]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !selectedSubject) return;

    setLoading(true);

    try {
      await onCreate({
        title,
        subject: selectedSubject.name,
        dueDate,
        dueTime,
        color: selectedSubject.color,
        subtasks: subtasks
          .split("\n")
          .map((subtask) => subtask.trim())
          .filter(Boolean)
      });

      setTitle("");
      setDueDate("");
      setDueTime("");
      setSubtasks("");
      // keep same subject for next add
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
        {!hasSubjects ? (
          <div
            style={{
              marginTop: "0.3rem",
              fontSize: "0.8rem",
              color: "#9ca3af"
            }}
          >
            No subjects yet. Add a subject from the sidebar first.
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              marginTop: "0.15rem"
            }}
          >
            <select
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              required
              style={{
                flex: 1,
                padding: "0.4rem 0.6rem",
                borderRadius: "0.6rem",
                border: "1px solid #d4d4d8",
                backgroundColor: "white"
              }}
            >
              {subjects.map((subj) => (
                <option key={subj.name} value={subj.name}>
                  {subj.name}
                </option>
              ))}
            </select>

            {selectedSubject && (
              <span
                title={`Color for ${selectedSubject.name}`}
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "999px",
                  backgroundColor: selectedSubject.color,
                  border: "2px solid #0f172a",
                  flexShrink: 0
                }}
              />
            )}
          </div>
        )}
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
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
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
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            disabled={!dueDate}
            style={{
              width: "100%",
              padding: "0.4rem 0.6rem",
              borderRadius: "0.6rem",
              border: "1px solid #d4d4d8",
              marginTop: "0.15rem",
              backgroundColor: dueDate ? "white" : "#f3f4f6"
            }}
          />
        </label>
      </div>

      <label style={{ fontSize: "0.9rem" }}>
        Subtasks
        <textarea
          value={subtasks}
          onChange={(e) => setSubtasks(e.target.value)}
          placeholder="One subtask per line"
          style={{
            width: "100%",
            padding: "0.4rem 0.6rem",
            borderRadius: "0.6rem",
            border: "1px solid #d4d4d8",
            marginTop: "0.15rem",
            minHeight: "4rem",
            resize: "vertical"
          }}
        />
      </label>

      <button
        type="submit"
        disabled={loading || !selectedSubject}
        className="primary-button"
        style={{
          marginTop: "0.5rem",
          justifyContent: "center"
        }}
      >
        {loading
          ? "Adding..."
          : selectedSubject
          ? "Add Assignment"
          : "Add a subject first"}
      </button>
    </form>
  );
};