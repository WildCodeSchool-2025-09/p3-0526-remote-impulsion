import { useState } from "react";
import workoutSessionService from "../../services/workoutSessionService";

const useDeletePreparedSession = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deletePreparedSession = async (sessionId: number) => {
    setLoading(true);
    setError(null);

    try {
      await workoutSessionService.deleteWorkSessions(sessionId);

      return true;
    } catch {
      setError("Impossible de supprimer la séance");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deletePreparedSession, loading, error };
};

export default useDeletePreparedSession;
