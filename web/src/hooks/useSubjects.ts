import { useEffect, useState } from "react";
import type { Subject } from "../components/SubjectForm";

const SUBJECTS_STORAGE_KEY = "assignment_bubbler_subjects";

/**
 * Manages subjects using localStorage as persistence.
 */
export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // Load subjects once on mount
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SUBJECTS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Subject[];
        setSubjects(parsed);
      }
    } catch {
      // ignore corrupt storage
    }
  }, []);

  function persist(next: Subject[]) {
    setSubjects(next);
    try {
      window.localStorage.setItem(
        SUBJECTS_STORAGE_KEY,
        JSON.stringify(next)
      );
    } catch {
      // ignore quota / storage errors
    }
  }

  function addSubject(
    newSubject: Subject
  ): { ok: true } | { ok: false; reason: string } {
    if (
      subjects.some(
        (s) => s.name.toLowerCase() === newSubject.name.toLowerCase()
      )
    ) {
      return { ok: false, reason: "Subject already exists" };
    }

    const next = [...subjects, newSubject].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    persist(next);
    return { ok: true };
  }

  function deleteSubject(name: string) {
    const next = subjects.filter((s) => s.name !== name);
    persist(next);
  }

  return {
    subjects,
    setSubjects: persist,
    addSubject,
    deleteSubject
  };
}