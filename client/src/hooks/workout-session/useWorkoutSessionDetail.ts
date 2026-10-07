import { useCallback, useEffect, useState } from "react";
import workoutSessionService from "../../services/workoutSessionService";
import type { WorkoutSessionDetail } from "../../types/workoutSession";

const useWorkoutSessionDetail = (sessionId: number) => {
  const [session, setSession] = useState<WorkoutSessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const loadSession = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);

    try {
      const data =
        await workoutSessionService.getWorkoutSessionDetail(sessionId);

      if (data === null) {
        setNotFound(true);
        return;
      }

      setSession(data);
    } catch {
      setError("Impossible de charger la séance");
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  return { session, loading, error, notFound, reload: loadSession };
};

export default useWorkoutSessionDetail;
