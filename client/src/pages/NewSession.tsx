import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";

import useCreatePreparedSession from "../hooks/workout-session/useCreatePreparedSession";
import usePreparedSessions from "../hooks/workout-session/usePreparedSessions";

function NewSession() {
  const { sessions, loading, error } = usePreparedSessions();
  const { createPreparedSession } = useCreatePreparedSession();
  const [sessionId, setSessionId] = useState<number | null>(null);
  const emptySession = sessions.find((session) => session.exerciseCount === 0);
  const creationStarted = useRef(false);

  useEffect(() => {
    if (loading || error || sessionId !== null) return;

    if (emptySession) {
      setSessionId(emptySession.id);
      return;
    }

    if (creationStarted.current) return;
    creationStarted.current = true;

    const createSession = async () => {
      const newSessionId = await createPreparedSession();

      if (newSessionId !== null) {
        setSessionId(newSessionId);
      } else {
        creationStarted.current = false;
      }
    };
    createSession();
  }, [loading, error, sessions, sessionId, createPreparedSession]);

  return (
    <>
      <h1 className="text-2xl font-display italic font-extrabold uppercase">
        Séance
      </h1>

      <Link to="/exercises">Ajouter des exercices</Link>
      <button type="button" disabled>
        Démarrer
      </button>
    </>
  );
}
export default NewSession;
