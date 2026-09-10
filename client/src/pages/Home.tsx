import { useNavigate } from "react-router";
import HomeSessionAction from "../components/HomeSessionAction";
import PreparedSessionsList from "../components/PreparedSessionsList";
import usePreparedSessions from "../hooks/workout-session/usePreparedSessions";

function Home() {
  const { sessions, loading, error } = usePreparedSessions();
  const navigate = useNavigate();

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  const emptySession = sessions.find((session) => session.exerciseCount === 0);
  const handleSessionAction = () => {
    navigate("/sessions/new");
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
          isLoading={false}
        />
      </section>

      <section>
        <PreparedSessionsList sessions={sessions} />
      </section>
    </>
  );
}

export default Home;
