export type Subtask = {
  id: number;
  text: string;
  completed: number; // 0 or 1
};

export type Assignment = {
  id: number;
  title: string;
  subject: string;
  dueDate: string; // yyyy-mm-dd
  color: string;
  completed: number; // 0 or 1
  subtasks?: Subtask[];
};