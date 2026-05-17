import React, { useEffect, useMemo, useState } from "react";
import type { Assignment } from "../types";

type Props = {
  assignments: Assignment[];
};

type ClassScheduleItem = {
  id: number;
  name: string;
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  location: string;
  color: string;
};

type DayInfo = {
  day: number;
  dateString: string;
  dayOfWeek: number;
  assignments: Assignment[];
  classes: ClassScheduleItem[];
};

const CLASS_SCHEDULE_STORAGE_KEY = "task-manager-class-schedule";

const WEEKDAYS = [
  { label: "Sun", value: 0 },
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 }
];

function formatDateKey(year: number, month: number, day: number) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function getTodayKey() {
  const today = new Date();
  return formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());
}

export const AssignmentCalendar: React.FC<Props> = ({ assignments }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [classSchedule, setClassSchedule] = useState<ClassScheduleItem[]>([]);

  const [className, setClassName] = useState("");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [classColor, setClassColor] = useState("#bfdbfe");

  useEffect(() => {
    const saved = window.localStorage.getItem(CLASS_SCHEDULE_STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as ClassScheduleItem[];
      if (Array.isArray(parsed)) {
        setClassSchedule(parsed);
      }
    } catch {
      window.localStorage.removeItem(CLASS_SCHEDULE_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      CLASS_SCHEDULE_STORAGE_KEY,
      JSON.stringify(classSchedule)
    );
  }, [classSchedule]);

  const assignmentsByDate = useMemo(() => {
    const map: Record<string, Assignment[]> = {};

    for (const assignment of assignments) {
      if (!assignment.dueDate) continue;

      const key = assignment.dueDate.slice(0, 10);
      if (!map[key]) map[key] = [];
      map[key].push(assignment);
    }

    return map;
  }, [assignments]);

  const days: DayInfo[] = useMemo(() => {
    const result: DayInfo[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDateKey(year, month, day);
      const dayOfWeek = new Date(year, month, day).getDay();

      result.push({
        day,
        dateString,
        dayOfWeek,
        assignments: assignmentsByDate[dateString] ?? [],
        classes: classSchedule.filter((classItem) =>
          classItem.daysOfWeek.includes(dayOfWeek)
        )
      });
    }

    return result;
  }, [year, month, assignmentsByDate, classSchedule]);

  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const monthName = today.toLocaleString("default", {
    month: "long"
  });

  function toggleSelectedDay(day: number) {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((existingDay) => existingDay !== day)
        : [...prev, day].sort((a, b) => a - b)
    );
  }

  function handleAddClass(e: React.FormEvent) {
    e.preventDefault();

    if (!className.trim() || selectedDays.length === 0 || !startTime || !endTime) {
      return;
    }

    const newClass: ClassScheduleItem = {
      id: Date.now(),
      name: className.trim(),
      daysOfWeek: selectedDays,
      startTime,
      endTime,
      location: location.trim(),
      color: classColor
    };

    setClassSchedule((prev) => [...prev, newClass]);

    setClassName("");
    setSelectedDays([]);
    setStartTime("");
    setEndTime("");
    setLocation("");
    setClassColor("#bfdbfe");
  }

  function handleDeleteClass(id: number) {
    setClassSchedule((prev) => prev.filter((classItem) => classItem.id !== id));
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
      }}
    >
      <div
        style={{
          width: "100%",
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
              fontSize: "1.35rem",
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
            Tasks and class schedule are shown directly on each day.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
            gap: "0.5rem",
            fontSize: "0.78rem",
            textAlign: "center",
            color: "#9ca3af",
            fontWeight: 700
          }}
        >
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
            gap: "0.5rem",
            fontSize: "0.85rem"
          }}
        >
          {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
            <div key={`empty-${idx}`} />
          ))}

          {days.map((dayInfo) => {
            const isToday = dayInfo.dateString === getTodayKey();
            const hasAssignments = dayInfo.assignments.length > 0;
            const hasClasses = dayInfo.classes.length > 0;
            const isHovered = hoveredDate === dayInfo.dateString;

            return (
              <div
                key={dayInfo.dateString}
                style={{
                  borderRadius: "0.9rem",
                  padding: "0.55rem",
                  minHeight: "125px",
                  display: "flex",
                  flexDirection: "column",
                  border: isToday
                    ? "1.5px solid #1d4ed8"
                    : "1px solid #e5e7eb",
                  backgroundColor:
                    hasAssignments || hasClasses ? "#f8fafc" : "white",
                  position: "relative",
                  overflow: "visible"
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
                    fontWeight: isToday ? 800 : 600,
                    color: isToday ? "#1d4ed8" : "#0f172a",
                    marginBottom: "0.35rem"
                  }}
                >
                  {dayInfo.day}
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                    minWidth: 0
                  }}
                >
                  {dayInfo.classes.slice(0, 2).map((classItem) => (
                    <div
                      key={`class-${classItem.id}`}
                      title={`${classItem.name} ${classItem.startTime}-${classItem.endTime}`}
                      style={{
                        borderRadius: "0.45rem",
                        padding: "0.18rem 0.35rem",
                        backgroundColor: classItem.color,
                        color: "#0f172a",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                    >
                      {classItem.name}
                    </div>
                  ))}

                  {dayInfo.assignments.slice(0, 3).map((assignment) => (
                    <div
                      key={`assignment-${assignment.id}`}
                      title={assignment.title}
                      style={{
                        borderRadius: "0.45rem",
                        padding: "0.18rem 0.35rem",
                        backgroundColor: assignment.color + "33",
                        borderLeft: `4px solid ${assignment.color}`,
                        color: "#0f172a",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                    >
                      {assignment.title}
                    </div>
                  ))}

                  {dayInfo.classes.length + dayInfo.assignments.length > 5 && (
                    <div
                      style={{
                        fontSize: "0.68rem",
                        color: "#6b7280",
                        marginTop: "0.1rem"
                      }}
                    >
                      +{dayInfo.classes.length + dayInfo.assignments.length - 5} more
                    </div>
                  )}
                </div>

                {isHovered && (hasAssignments || hasClasses) && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: "50%",
                      transform: "translateX(-50%) translateY(8px)",
                      backgroundColor: "white",
                      borderRadius: "0.75rem",
                      boxShadow: "0 12px 30px rgba(15, 23, 42, 0.25)",
                      padding: "0.65rem 0.75rem",
                      minWidth: "260px",
                      zIndex: 20
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        marginBottom: "0.35rem",
                        color: "#0f172a"
                      }}
                    >
                      {dayInfo.dateString}
                    </div>

                    {dayInfo.classes.length > 0 && (
                      <div style={{ marginBottom: "0.45rem" }}>
                        <div
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            color: "#6b7280",
                            marginBottom: "0.2rem"
                          }}
                        >
                          Classes
                        </div>

                        {dayInfo.classes.map((classItem) => (
                          <div
                            key={classItem.id}
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
                                width: "9px",
                                height: "9px",
                                borderRadius: "999px",
                                backgroundColor: classItem.color,
                                flexShrink: 0
                              }}
                            />

                            <span style={{ fontWeight: 600 }}>
                              {classItem.name}
                            </span>

                            <span
                              style={{
                                marginLeft: "auto",
                                color: "#6b7280",
                                fontSize: "0.7rem"
                              }}
                            >
                              {classItem.startTime}-{classItem.endTime}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {dayInfo.assignments.length > 0 && (
                      <div>
                        <div
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            color: "#6b7280",
                            marginBottom: "0.2rem"
                          }}
                        >
                          Assignments
                        </div>

                        {dayInfo.assignments.map((assignment) => (
                          <div
                            key={assignment.id}
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
                                width: "9px",
                                height: "9px",
                                borderRadius: "999px",
                                backgroundColor: assignment.color,
                                flexShrink: 0
                              }}
                            />

                            <span
                              style={{
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                              }}
                            >
                              {assignment.title}
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
                              {assignment.subject}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          width: "100%",
          borderRadius: "1.5rem",
          backgroundColor: "white",
          boxShadow: "0 10px 30px rgba(148, 163, 184, 0.25)",
          padding: "1.25rem 1.5rem",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.1fr) minmax(260px, 0.9fr)",
          gap: "1.25rem"
        }}
      >
        <form
          onSubmit={handleAddClass}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem"
          }}
        >
          <h3 style={{ margin: 0 }}>Add Class Schedule</h3>

          <label style={{ fontSize: "0.9rem" }}>
            Class name
            <input
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
              placeholder="Ex: Thermodynamics"
              style={{
                width: "100%",
                padding: "0.4rem 0.6rem",
                borderRadius: "0.6rem",
                border: "1px solid #d4d4d8",
                marginTop: "0.15rem"
              }}
            />
          </label>

          <div>
            <div style={{ fontSize: "0.9rem", marginBottom: "0.25rem" }}>
              Days
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.4rem"
              }}
            >
              {WEEKDAYS.map((day) => (
                <label
                  key={day.value}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    fontSize: "0.85rem",
                    padding: "0.25rem 0.45rem",
                    borderRadius: "999px",
                    border: selectedDays.includes(day.value)
                      ? "1px solid #1d4ed8"
                      : "1px solid #d4d4d8",
                    backgroundColor: selectedDays.includes(day.value)
                      ? "#eff6ff"
                      : "white",
                    cursor: "pointer"
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedDays.includes(day.value)}
                    onChange={() => toggleSelectedDay(day.value)}
                  />
                  {day.label}
                </label>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem"
            }}
          >
            <label style={{ fontSize: "0.9rem" }}>
              Start time
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
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
              End time
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
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
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 90px",
              gap: "0.75rem"
            }}
          >
            <label style={{ fontSize: "0.9rem" }}>
              Location
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Optional"
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
              <input
                type="color"
                value={classColor}
                onChange={(e) => setClassColor(e.target.value)}
                style={{
                  width: "100%",
                  height: "2.25rem",
                  padding: "0.15rem",
                  borderRadius: "0.6rem",
                  border: "1px solid #d4d4d8",
                  marginTop: "0.15rem",
                  backgroundColor: "white"
                }}
              />
            </label>
          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={
              !className.trim() ||
              selectedDays.length === 0 ||
              !startTime ||
              !endTime
            }
            style={{
              marginTop: "0.25rem",
              justifyContent: "center"
            }}
          >
            Add Class
          </button>
        </form>

        <div>
          <h3 style={{ margin: 0, marginBottom: "0.75rem" }}>
            Current Classes
          </h3>

          {classSchedule.length === 0 ? (
            <p
              style={{
                color: "#6b7280",
                fontSize: "0.9rem",
                margin: 0
              }}
            >
              No classes added yet.
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem"
              }}
            >
              {classSchedule.map((classItem) => (
                <div
                  key={classItem.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.85rem",
                    padding: "0.65rem 0.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    backgroundColor: "#f8fafc"
                  }}
                >
                  <span
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "999px",
                      backgroundColor: classItem.color,
                      flexShrink: 0
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                    >
                      {classItem.name}
                    </div>

                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: "#6b7280"
                      }}
                    >
                      {classItem.daysOfWeek
                        .map(
                          (dayValue) =>
                            WEEKDAYS.find((day) => day.value === dayValue)?.label
                        )
                        .join(", ")}{" "}
                      · {classItem.startTime}-{classItem.endTime}
                      {classItem.location ? ` · ${classItem.location}` : ""}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteClass(classItem.id)}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      color: "#ef4444",
                      fontSize: "0.85rem",
                      fontWeight: 700
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};