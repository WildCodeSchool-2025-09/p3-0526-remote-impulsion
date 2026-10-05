import { useEffect, useState } from "react";
import workoutTemplateService from "../../services/workoutTemplateService";
import type { WorkoutTemplate } from "../../types/workoutTemplate";

function useWorkoutTemplates() {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingExerciseId, setUpdatingExerciseId] = useState<number | null>(
    null,
  );
  const [preparingTemplateId, setPreparingTemplateId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setTemplates(await workoutTemplateService.getWorkoutTemplates());
      } catch {
        setError("Impossible de charger les séances types");
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  const updateExerciseRest = async (
    templateId: number,
    templateExerciseId: number,
    restSeconds: number | null,
  ) => {
    setUpdatingExerciseId(templateExerciseId);
    setError(null);

    try {
      await workoutTemplateService.updateWorkoutTemplateExerciseRest(
        templateId,
        templateExerciseId,
        restSeconds,
      );

      setTemplates((currentTemplates) =>
        currentTemplates.map((template) =>
          template.id === templateId
            ? {
                ...template,
                exercises: template.exercises.map((exercise) =>
                  exercise.templateExerciseId === templateExerciseId
                    ? { ...exercise, restSeconds }
                    : exercise,
                ),
              }
            : template,
        ),
      );
    } catch {
      setError("Impossible de modifier le temps de repos");
    } finally {
      setUpdatingExerciseId(null);
    }
  };

  const prepareSession = async (templateId: number) => {
    setPreparingTemplateId(templateId);
    setError(null);

    try {
      return await workoutTemplateService.prepareWorkoutSession(templateId);
    } catch {
      setError("Impossible de préparer la séance");
      return null;
    } finally {
      setPreparingTemplateId(null);
    }
  };

  return {
    templates,
    loading,
    error,
    updatingExerciseId,
    preparingTemplateId,
    updateExerciseRest,
    prepareSession,
  };
}

export default useWorkoutTemplates;
