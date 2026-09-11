import { useNavigate, useParams, Link } from "react-router";

import useDeletePreparedSession from "../hooks/workout-session/useDeletePreparedSession";
import useWorkoutSession from "../hooks/workout-session/useWorkoutSession";

function SessionId() {
  const { id } = useParams();
  const navigate = useNavigate();

  const sessionId = Number(id);
  const { session, loading, error } = useWorkoutSession(sessionId);

  const {
    deletePreparedSession,
    loading: deleteLoading,
    error: deleteError,
  } = useDeletePreparedSession();

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error || deleteError) {
    return <p>{error || deleteError}</p>;
  }

  if (!session) {
    return <p>Séance introuvable.</p>;
  }

  const handleDelete = async () => {
    const deleted = await deletePreparedSession(session.id);

    if (deleted) {
      navigate("/sessions");
    }
  };

  return (
    <>
      <h1 className="text-2xl font-display italic font-extrabold uppercase">
        Séance
      </h1>

      <p>
        {session.exerciseCount}{" "}
        {session.exerciseCount === 1 ? "exercice" : "exercices"}
      </p>

      <Link to="/exercises">Ajouter des exercices</Link>

      <button type="button" disabled={session.exerciseCount === 0}>
        Démarrer
      </button>

      <button type="button" onClick={handleDelete} disabled={deleteLoading}>
        {deleteLoading ? "Suppression..." : "Supprimer la séance"}
      </button>
    </>
  );
}

export default SessionId;
