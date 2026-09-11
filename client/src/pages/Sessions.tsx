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
    <div className="mx-auto w-full max-w-5xl md:py-4">
      <h1 className="font-display font-extrabold text-2xl uppercase italic">
        Mes séances
      </h1>

      <PreparedSessionsList sessions={sessions} />
    </div>
  );
}

export default Sessions;
