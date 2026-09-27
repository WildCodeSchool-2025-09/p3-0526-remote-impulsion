import { useContext, useState } from "react";
import { CurrentSessionContext } from "../../contexts/CurrentSessionContext";
import workoutSessionService from "../../services/workoutSessionService";

const useCompleteSession = () => {
  const context = useContext(CurrentSessionContext);

  if (context === null) {
    throw new Error("CurrentSessionContext est indisponible");
  }

  const { refreshCurrentSession } = context;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completeSession = async (sessionId: number) => {
    setLoading(true);
    setError(null);

    try {
      await workoutSessionService.completeWorkoutSession(sessionId);
      await refreshCurrentSession();
      return true;
    } catch {
      setError("Impossible de valider la séance");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { completeSession, loading, error };
};

export default useCompleteSession;
