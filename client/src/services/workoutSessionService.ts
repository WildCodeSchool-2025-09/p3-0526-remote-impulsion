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

const postWorkoutSession = async (): Promise<number> => {
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

const deleteWorkoutSession = async (sessionId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/api/workout-sessions/${sessionId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Impossible de supprimer la séance");
  }
};

const postExercisesToSession = async (
  sessionId: number,
  exerciseIds: number[],
): Promise<void> => {
  const response = await fetch(
    `${API_URL}/api/workout-sessions/${sessionId}/exercises`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ exerciseIds }),
    },
  );
  if (!response.ok) {
    throw new Error("Impossible d'ajouter les exercices");
  }
};

export default {
  getWorkoutSessions,
  postWorkoutSession,
  getWorkoutSessionById,
  deleteWorkoutSession,
  postExercisesToSession,
};
