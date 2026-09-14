export type WorkoutSession = {
  id: number;
  userId: number;
  createdAt: string;
  startedAt: string | null;
  endedAt: string | null;
  status: WorkoutSessionStatus;
  exerciseCount: number;
};

export type WorkoutSessionStatus = "prepared" | "in_progress" | "completed";
