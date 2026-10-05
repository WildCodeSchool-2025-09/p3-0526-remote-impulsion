export type WorkoutSession = {
  id: number;
  userId: number;
  createdAt: string;
  startedAt: string | null;
  endedAt: string | null;
  status: WorkoutSessionStatus;
};

export type ExerciseSet = {
  id: number;
  workoutSessionExerciseId: number;
  setNumber: number;
  repetitions: number | null;
  weightKg: number | null;
  durationSeconds: number | null;
  isCompleted: boolean;
};

export type CreateSetPayload = {
  repetitions?: number | null;
  weightKg?: number | null;
  durationSeconds?: number | null;
  isCompleted?: boolean;
};

export type WorkoutSessionStatus = "prepared" | "in_progress" | "completed";
