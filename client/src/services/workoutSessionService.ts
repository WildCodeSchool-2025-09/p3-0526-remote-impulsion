import type { WorkoutSession } from "../types/workoutSession";

const API_URL = import.meta.env.VITE_API_URL;

const getWorkoutSessions = async (): Promise<WorkoutSession[]> => {
  const response = await fetch(`${API_URL}/api/workout-sessions`);
  const sessions = await response.json();

  return sessions;
};

const postWorkSessions = async (): Promise<number> => {
  const response = await fetch(`${API_URL}/api/workout-sessions`, {
    method: "POST",
  });
  const { id: sessionId } = await response.json();

  return sessionId;
};

const deleteWorkSessions = async (sessionId: number): Promise<void> => {
  await fetch(`${API_URL}/api/workout-sessions/${sessionId}`, {
    method: "DELETE",
  });
};

export default { getWorkoutSessions, postWorkSessions, deleteWorkSessions };
