import { useEffect, useState } from "react";
import workoutSessionService from "../../services/workoutSessionService";
import type { WorkoutSessionSummary } from "../../types/workoutSession";

const useSessionSummary = (sessionId: number) => {
  const [summary, setSummary] = useState<WorkoutSessionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isInteger(sessionId) || sessionId <= 0) {
      setSummary(null);
      setLoading(false);
      setError(null);
      return;
    }

    const loadSummary = async () => {
      setLoading(true);
      setError(null);

      try {
        const summaryData =
          await workoutSessionService.getSessionSummary(sessionId);
        setSummary(summaryData);
      } catch {
        setError("Impossible de charger le récapitulatif");
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, [sessionId]);

  return { summary, loading, error };
};

export default useSessionSummary;
