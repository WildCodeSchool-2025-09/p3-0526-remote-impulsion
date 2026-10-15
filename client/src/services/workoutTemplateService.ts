import type { WorkoutTemplate } from "../types/workoutTemplate";

const API_URL = import.meta.env.VITE_API_URL;

const getWorkoutTemplates = async (): Promise<WorkoutTemplate[]> => {
  const response = await fetch(`${API_URL}/api/workout-templates`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Impossible de charger les séances types");
  }

  return response.json();
};

const updateWorkoutTemplateExerciseRest = async (
  templateId: number,
  templateExerciseId: number,
  restSeconds: number | null,
): Promise<void> => {
  const response = await fetch(
    `${API_URL}/api/workout-templates/${templateId}/exercises/${templateExerciseId}/rest`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ restSeconds }),
    },
  );

  if (!response.ok) {
    throw new Error("Impossible de modifier le temps de repos");
  }
};

const prepareWorkoutSession = async (templateId: number): Promise<number> => {
  const response = await fetch(
    `${API_URL}/api/workout-templates/${templateId}/sessions`,
    {
      method: "POST",
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Impossible de préparer la séance");
  }

  const { id } = await response.json();
  return id;
};

export default {
  getWorkoutTemplates,
  updateWorkoutTemplateExerciseRest,
  prepareWorkoutSession,
};
