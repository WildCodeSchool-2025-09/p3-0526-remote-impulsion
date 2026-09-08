import { useState } from "react";
import workoutSessionService from "../services/workoutSessionService";

const useCreatePreparedSession = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPreparedSession = async () => {
    setLoading(true);
    setError(null);

    try {
      const sessionId = await workoutSessionService.postWorkSessions();
      return sessionId;
    } catch {
      setError("Impossible de créer la séance");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createPreparedSession, loading, error };
};

export default useCreatePreparedSession;
