import { useContext, useState } from "react";
import { CurrentSessionContext } from "../../contexts/CurrentSessionContext";
import workoutSessionService from "../../services/workoutSessionService";

const useAbandonSession = () => {
  const context = useContext(CurrentSessionContext);

  if (context === null) {
    throw new Error("CurrentSessionContext est indisponible");
  }

  const { refreshCurrentSession } = context;
  const [isAbandoning, setIsAbandoning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abandonSession = async (sessionId: number) => {
    setIsAbandoning(true);
    setError(null);

    try {
      await workoutSessionService.abandonSession(sessionId);
      await refreshCurrentSession();
      return true;
    } catch {
      setError("Impossible d'abandonner la séance");
      return false;
    } finally {
      setIsAbandoning(false);
    }
  };
  return { abandonSession, isAbandoning, error };
};

export default useAbandonSession;
