import { useEffect, useState } from "react";
import exerciseApi from "../services/exerciseApi";
import type { ExerciseSummary } from "../types/exercise";

function useExercises() {
  const [exercises, setExercises] = useState<ExerciseSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  async function loadExercises() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await exerciseApi.fetchExercises();
      setExercises(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: on veut charger une seule fois au montage
  useEffect(() => {
    loadExercises();
  }, []);

  return { exercises, isLoading, error, retry: loadExercises };
}

export default useExercises;
