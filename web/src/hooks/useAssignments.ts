import { useEffect, useState } from "react";
import type { Assignment } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:3000";

type UseAssignmentsArgs = {
  subjectFilter: string;
  sortBy: "dueDate" | "subject";
  onError: (msg: string) => void;
};

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 10000
) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal
    });
  } finally {
    window.clearTimeout(timeoutId);
  }
}

/**
 * Handles fetching + CRUD for assignments from the backend.
 */
export function useAssignments({
  subjectFilter,
  sortBy,
  onError
}: UseAssignmentsArgs) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadAssignments() {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (subjectFilter) params.set("subject", subjectFilter);
      if (sortBy) params.set("sortBy", sortBy);

      const res = await fetchWithTimeout(
        `${API_BASE}/assignments?${params.toString()}`
      );

      if (!res.ok) throw new Error("Failed to load assignments");

      const data = (await res.json()) as Assignment[];
      setAssignments(data);
    } catch (err: any) {
      console.error(err);

      if (err.name === "AbortError") {
        onError("Backend took too long to respond. Check if Render is awake.");
      } else {
        onError(err.message ?? "Error loading assignments");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectFilter, sortBy]);

  async function createAssignment(input: {
    title: string;
    subject: string;
    dueDate: string;
    color: string;
    subtasks?: string[];
  }) {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      });

      if (!res.ok) {
        let message = "Failed to create assignment";

        try {
          const data = await res.json();
          if (data?.error) message = data.error;
        } catch {
          // ignore
        }

        throw new Error(message);
      }

      await loadAssignments();
    } catch (err: any) {
      if (err.name === "AbortError") {
        throw new Error("Backend took too long to respond. Check if Render is awake.");
      }

      throw err;
    }
  }

  async function updateAssignment(
    id: number,
    fields: Partial<Omit<Assignment, "id">>
  ) {
    const res = await fetchWithTimeout(`${API_BASE}/assignments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields)
    });

    if (!res.ok) {
      let message = "Failed to update assignment";

      try {
        const data = await res.json();
        if (data?.error) message = data.error;
      } catch {
        // ignore
      }

      throw new Error(message);
    }

    const updated = (await res.json()) as Assignment;

    setAssignments((prev) =>
      prev.map((assignment) =>
        assignment.id === id ? updated : assignment
      )
    );
  }

  async function deleteAssignment(id: number) {
    const res = await fetchWithTimeout(`${API_BASE}/assignments/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) {
      let message = "Failed to delete assignment";

      try {
        const data = await res.json();
        if (data?.error) message = data.error;
      } catch {
        // ignore
      }

      throw new Error(message);
    }

    setAssignments((prev) => prev.filter((a) => a.id !== id));
  }

  return {
    assignments,
    loading,
    reload: loadAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment
  };
}