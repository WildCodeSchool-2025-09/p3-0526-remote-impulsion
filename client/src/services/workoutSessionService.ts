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

const getCurrentSession = async (): Promise<WorkoutSession | null> => {
  const response = await fetch(`${API_URL}/api/workout-sessions/current`);
  if (!response.ok) {
    throw new Error("Impossible de charger la séance en cours");
  }
  const currentSession = await response.json();
  return currentSession;
};

const startWorkoutSession = async (sessionId: number) => {
  const response = await fetch(
    `${API_URL}/api/workout-sessions/${sessionId}/start`,
    { method: "PATCH" },
  );
  if (response.status === 409) {
    const conflict = await response.json().catch(() => null);

    return {
      result: "conflict",
      currentSessionId: conflict?.currentSessionId ?? null,
    };
  }
  if (!response.ok) {
    throw new Error("Impossible de démarrer la séance");
  }
  return {
    result: "started",
  };
};

const deleteWorkoutSession = async (sessionId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/api/workout-sessions/${sessionId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Impossible de supprimer la séance");
  }
};

export default {
  getWorkoutSessions,
  postWorkoutSession,
  getWorkoutSessionById,
  getCurrentSession,
  startWorkoutSession,
  deleteWorkoutSession,
};
