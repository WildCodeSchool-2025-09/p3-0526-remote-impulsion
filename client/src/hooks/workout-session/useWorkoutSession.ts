import { useEffect, useState } from "react";
import workoutSessionService from "../../services/workoutSessionService";
import type { WorkoutSession } from "../../types/workoutSession";

const useWorkoutSession = (sessionId: number) => {
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSessions = async () => {
      setLoading(true);
      setError(null);

      try {
        const sessionData =
          await workoutSessionService.getWorkoutSessionById(sessionId);
        setSession(sessionData);
      } catch {
        setError("Impossible de charger les séances");
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, [sessionId]);

  return { session, loading, error };
};

export default useWorkoutSession;
