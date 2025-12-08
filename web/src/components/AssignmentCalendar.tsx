import React, { useMemo, useState } from "react";
import type { Assignment } from "../types";

type Props = {
  assignments: Assignment[];
};

type DayInfo = {
  day: number;
  dateString: string;
  assignments: Assignment[];
};

export const AssignmentCalendar: React.FC<Props> = ({ assignments }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed

  // Map "YYYY-MM-DD" -> assignments[]
  const assignmentsByDate = useMemo(() => {
    const map: Record<string, Assignment[]> = {};
    for (const a of assignments) {
      const key = a.dueDate.slice(0, 10); // assume "YYYY-MM-DD"
      if (!map[key]) map[key] = [];
      map[key].push(a);
    }
    return map;
  }, [assignments]);

  const days: DayInfo[] = useMemo(() => {
    const result: DayInfo[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const mm = String(month + 1).padStart(2, "0");
      const dd = String(d).padStart(2, "0");
      const key = `${year}-${mm}-${dd}`;
      result.push({
        day: d,
        dateString: key,
        assignments: assignmentsByDate[key] ?? []
      });
    }
    return result;
  }, [year, month, assignmentsByDate]);

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun
  const monthName = today.toLocaleString("default", {
    month: "long"
  });

  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "340px",
        borderRadius: "1.5rem",
        backgroundColor: "white",
        boxShadow: "0 10px 30px rgba(148, 163, 184, 0.35)",
        padding: "1.25rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.85rem"
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            fontSize: "1.25rem",
            textAlign: "center"
          }}
        >
          {monthName} {year}
        </h2>
        <p
          style={{
            margin: 0,
            marginTop: "0.2rem",
            textAlign: "center",
            fontSize: "0.85rem",
            color: "#6b7280"
          }}
        >
          Hover a day to preview its assignments.
        </p>
      </div>

      {/* Weekday labels */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "0.35rem",
          fontSize: "0.75rem",
          textAlign: "center",
          color: "#9ca3af",
          fontWeight: 600
        }}
      >
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "0.35rem",
          fontSize: "0.85rem"
        }}
      >
        {/* Leading empty cells before first day */}
        {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
          <div key={`empty-${idx}`} />
        ))}

        {days.map((dayInfo) => {
          const isToday =
            dayInfo.dateString === today.toISOString().slice(0, 10);
          const hasAssignments = dayInfo.assignments.length > 0;
          const isHovered = hoveredDate === dayInfo.dateString;

          return (
            <div
              key={dayInfo.dateString}
              style={{
                borderRadius: "0.9rem",
                padding: "0.4rem 0.2rem",
                minHeight: "52px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                border: isToday ? "1.5px solid #1d4ed8" : "1px solid #e5e7eb",
                backgroundColor: hasAssignments ? "#eff6ff" : "white",
                position: "relative"
              }}
              onMouseEnter={() => setHoveredDate(dayInfo.dateString)}
              onMouseLeave={() =>
                setHoveredDate((prev) =>
                  prev === dayInfo.dateString ? null : prev
                )
              }
            >
              <div
                style={{
                  fontWeight: isToday ? 700 : 500,
                  color: isToday ? "#1d4ed8" : "#0f172a"
                }}
              >
                {dayInfo.day}
              </div>

              {/* Dots for assignments (up to 3) */}
              <div
                style={{
                  display: "flex",
                  gap: "3px",
                  marginTop: "4px",
                  flexWrap: "wrap",
                  justifyContent: "center"
                }}
              >
                {dayInfo.assignments.slice(0, 3).map((a) => (
                  <span
                    key={a.id}
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "999px",
                      backgroundColor: a.color
                    }}
                  />
                ))}
                {dayInfo.assignments.length > 3 && (
                  <span
                    style={{
                      fontSize: "0.65rem",
                      color: "#6b7280",
                      marginLeft: "2px"
                    }}
                  >
                    +{dayInfo.assignments.length - 3}
                  </span>
                )}
              </div>

              {/* Hover preview tooltip */}
              {isHovered && hasAssignments && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%) translateY(8px)",
                    backgroundColor: "white",
                    borderRadius: "0.75rem",
                    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.25)",
                    padding: "0.5rem 0.65rem",
                    minWidth: "220px",
                    zIndex: 20
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      marginBottom: "0.25rem",
                      color: "#0f172a"
                    }}
                  >
                    Assignments on {dayInfo.dateString}
                  </div>
                  {dayInfo.assignments.slice(0, 3).map((a) => (
                    <div
                      key={a.id}
                      style={{
                        fontSize: "0.75rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        marginBottom: "0.15rem"
                      }}
                    >
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "999px",
                          backgroundColor: a.color,
                          flexShrink: 0
                        }}
                      />
                      <span
                        style={{
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}
                      >
                        {a.title}
                      </span>
                      <span
                        style={{
                          marginLeft: "auto",
                          fontSize: "0.7rem",
                          padding: "0.05rem 0.3rem",
                          borderRadius: "999px",
                          backgroundColor: "#eff6ff",
                          color: "#1d4ed8"
                        }}
                      >
                        {a.subject}
                      </span>
                    </div>
                  ))}
                  {dayInfo.assignments.length > 3 && (
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: "#6b7280",
                        marginTop: "0.1rem"
                      }}
                    >
                      + {dayInfo.assignments.length - 3} more…
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};