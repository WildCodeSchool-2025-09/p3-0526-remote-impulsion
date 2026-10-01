import type { WorkoutSession } from "../types/workoutSession";

const API_URL = import.meta.env.VITE_API_URL;

const getWorkoutSessions = async (): Promise<WorkoutSession[]> => {
  const response = await fetch(`${API_URL}/api/workout-sessions`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Impossible de charger les séances");
  }
  const sessions = await response.json();
  return sessions;
};

const postWorkoutSession = async (): Promise<number> => {
  const response = await fetch(`${API_URL}/api/workout-sessions`, {
    method: "POST",
    credentials: "include",
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
  const response = await fetch(`${API_URL}/api/workout-sessions/${sessionId}`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Impossible de charger la séance");
  }
  const session = await response.json();
  return session;
};

const getCurrentSession = async (): Promise<WorkoutSession | null> => {
  const response = await fetch(`${API_URL}/api/workout-sessions/current`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Impossible de charger la séance en cours");
  }
  const currentSession = await response.json();
  return currentSession;
};

const startWorkoutSession = async (sessionId: number) => {
  const response = await fetch(
    `${API_URL}/api/workout-sessions/${sessionId}/start`,
    { method: "PATCH", credentials: "include" },
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

const abandonSession = async (sessionId: number): Promise<void> => {
  const response = await fetch(
    `${API_URL}/api/workout-sessions/${sessionId}/abandon`,
    { method: "PATCH", credentials: "include" },
  );
  if (!response.ok) {
    throw new Error("Impossible d'abandonner la séance");
  }
};

const deleteWorkoutSession = async (sessionId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/api/workout-sessions/${sessionId}`, {
    method: "DELETE",
    credentials: "include",
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
      credentials: "include",
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

const reorderWorkoutSessionExercises = async (
  sessionId: number,
  sessionExerciseIds: number[],
): Promise<void> => {
  const response = await fetch(
    `${API_URL}/api/workout-sessions/${sessionId}/exercises/order`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionExerciseIds }),
    },
  );
  if (!response.ok) {
    throw new Error("Impossible d'ordonner les exercices");
  }
};

export default {
  getWorkoutSessions,
  postWorkoutSession,
  getWorkoutSessionById,
  getCurrentSession,
  startWorkoutSession,
  abandonSession,
  deleteWorkoutSession,
  postExercisesToSession,
  reorderWorkoutSessionExercises,
};
