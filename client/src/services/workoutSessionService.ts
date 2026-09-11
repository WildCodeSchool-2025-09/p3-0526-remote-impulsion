import type { WorkoutSession } from "../types/workoutSession";

const API_URL = import.meta.env.VITE_API_URL;

const getWorkoutSessions = async (): Promise<WorkoutSession[]> => {
  const response = await fetch(`${API_URL}/api/workout-sessions`);

  if (!response.ok) {
    throw new Error("Impossible de charger les séances");
  }

  const sessions = await response.json();

  return sessions;
};

const postWorkSessions = async (): Promise<number> => {
  const response = await fetch(`${API_URL}/api/workout-sessions`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Impossible de créer la séance");
  }

  const { id: sessionId } = await response.json();

  return sessionId;
};

const getWorkoutSessionById = async (
  sessionId: number,
): Promise<WorkoutSession> => {
  const response = await fetch(`${API_URL}/api/workout-sessions/${sessionId}`);

  if (!response.ok) {
    throw new Error("Impossible de charger la séance");
  }

  const session = await response.json();

  return session;
};

const deleteWorkSessions = async (sessionId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/api/workout-sessions/${sessionId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Impossible de supprimer la séance");
  }
};

export default {
  getWorkoutSessions,
  postWorkSessions,
  getWorkoutSessionById,
  deleteWorkSessions,
};
