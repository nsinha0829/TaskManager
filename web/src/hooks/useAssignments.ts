import { useEffect, useState } from "react";
import type { Assignment } from "../types";

const API_BASE = "http://localhost:3000";

type UseAssignmentsArgs = {
  subjectFilter: string;
  sortBy: "dueDate" | "subject";
  onError: (msg: string) => void;
};

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

      const res = await fetch(`${API_BASE}/assignments?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load assignments");

      const data = (await res.json()) as Assignment[];
      setAssignments(data);
    } catch (err: any) {
      console.error(err);
      onError(err.message ?? "Error loading assignments");
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
  }) {
    const res = await fetch(`${API_BASE}/assignments`, {
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
  }

  async function deleteAssignment(id: number) {
    const res = await fetch(`${API_BASE}/assignments/${id}`, {
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
    deleteAssignment
  };
}