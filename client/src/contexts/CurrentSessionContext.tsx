import { createContext, useEffect, useState, type ReactNode } from "react";
import workoutSessionService from "../services/workoutSessionService";
import type { WorkoutSession } from "../types/workoutSession";

type CurrentSessionContextType = {
  currentSession: WorkoutSession | null;
  refreshCurrentSession: () => Promise<void>;
};

export const CurrentSessionContext =
  createContext<CurrentSessionContextType | null>(null);

export const CurrentSessionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [currentSession, setCurrentSession] = useState<WorkoutSession | null>(
    null,
  );

  const refreshCurrentSession = async () => {
    const session = await workoutSessionService.getCurrentSession();
    setCurrentSession(session);
  };

  useEffect(() => {
    refreshCurrentSession();
  }, []);

  return (
    <CurrentSessionContext.Provider
      value={{ currentSession, refreshCurrentSession }}
    >
      {children}
    </CurrentSessionContext.Provider>
  );
};
