import { useNavigate } from "react-router";
import HomeSessionAction from "../components/HomeSessionAction";
import PreparedSessionsList from "../components/PreparedSessionsList";
import useCreatePreparedSession from "../hooks/workout-session/useCreatePreparedSession";
import usePreparedSessions from "../hooks/workout-session/usePreparedSessions";

function Home() {
  const { sessions, loading, error } = usePreparedSessions();
  const { createPreparedSession, loading: createLoading } =
    useCreatePreparedSession();
  const navigate = useNavigate();

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const emptySession = sessions.find((session) => session.exerciseCount === 0);

  const handleSessionAction = async () => {
    if (emptySession) {
      navigate(`/sessions/${emptySession.id}`);
      return;
    }

    const newSessionId = await createPreparedSession();

    if (newSessionId !== null) {
      navigate(`/sessions/${newSessionId}`);
    }
  };

  return (
    <>
      <section>
        <h1>PRÊT POUR TA SÉANCE ?</h1>

        <HomeSessionAction
          subtitle={
            emptySession
              ? "Ta séance est créée, ajoute maintenant tes exercices."
              : "Ajoute tes exercices, puis démarre quand tu veux."
          }
          buttonLabel={
            emptySession ? "AJOUTER DES EXERCICES" : "CRÉER UNE SÉANCE"
          }
          onAction={handleSessionAction}
          isLoading={createLoading}
        />
      </section>

      <section>
        <PreparedSessionsList sessions={sessions} limit={3} />
      </section>
    </>
  );
}

export default Home;
