import PreparedSessionsList from "../components/PreparedSessionsList";
import usePreparedSessions from "../hooks/workout-session/usePreparedSessions";

function Sessions() {
  const { sessions, loading, error } = usePreparedSessions();

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <h1 className="text-2xl font-display italic font-extrabold uppercase">
        Mes séances
      </h1>

      <PreparedSessionsList sessions={sessions} />
    </>
  );
}

export default Sessions;
