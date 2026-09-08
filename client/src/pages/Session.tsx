import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";

import useCreatePreparedSession from "../hooks/workout-session/useCreatePreparedSession";
import usePreparedSessions from "../hooks/workout-session/usePreparedSessions";

function Session() {
  const { sessions, loading, error } = usePreparedSessions();
  const { createPreparedSession } = useCreatePreparedSession();
  const [sessionId, setSessionId] = useState<number | null>(null);
  const creationStarted = useRef(false);

  useEffect(() => {
    if (loading || error || sessionId !== null) return;

    if (sessions.length > 0) {
      setSessionId(sessions[0].id);
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
export default Session;
