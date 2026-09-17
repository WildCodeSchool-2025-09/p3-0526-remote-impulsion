import type { ExerciseSummary } from "./exercise";

export type WorkoutSessionExercise = ExerciseSummary & {
  sessionExerciseId: number;
  position: number;
  targetSets: number | null;
  targetReps: number | null;
  targetWeightKg: number | string | null;
  targetDurationSeconds: number | null;
  restSeconds: number | null;
};

export type WorkoutSession = {
  id: number;
  userId: number;
  createdAt: string;
  startedAt: string | null;
  endedAt: string | null;
  status: WorkoutSessionStatus;
  exerciseCount: number;
  exercises?: WorkoutSessionExercise[];
};

export type WorkoutSessionStatus = "prepared" | "in_progress" | "completed";
