import { Link, useNavigate, useParams } from "react-router";

import TrashIcon from "../assets/icons/actions/corbeille.svg?react";
import PlayIcon from "../assets/icons/actions/play-circle.svg?react";
import PlusIcon from "../assets/icons/actions/plus.svg?react";
import BarbellIcon from "../assets/icons/navigation/barbell.svg?react";
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

  const formattedDate = new Date(session.createdAt).toLocaleDateString(
    "fr-FR",
    {
      day: "numeric",
      month: "long",
    },
  );

  const handleDelete = async () => {
    const deleted = await deletePreparedSession(session.id);

    if (deleted) {
      navigate("/sessions");
    }
  };

  return (
    <div className="w-full max-w-3xl md:py-4 lg:px-4">
      <div className="flex items-center justify-between gap-2 lg:border-base-300 lg:border-b lg:pb-6">
        <h1 className="font-display font-extrabold text-2xl uppercase italic lg:text-4xl">
          Séance du {formattedDate}
        </h1>

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteLoading}
          className="-my-2 -mr-2 grid size-10 shrink-0 place-items-center rounded-full text-error transition-colors hover:bg-error/15 focus-visible:outline-2 focus-visible:outline-error focus-visible:outline-offset-2 disabled:cursor-wait disabled:opacity-60 lg:m-0 lg:flex lg:size-auto lg:gap-2 lg:rounded-lg lg:border lg:border-error/50 lg:px-4 lg:py-2 lg:font-semibold lg:text-sm lg:hover:bg-error/10"
        >
          <TrashIcon aria-hidden="true" className="size-5 lg:size-4" />
          <span className="sr-only lg:not-sr-only">
            {deleteLoading ? "Suppression..." : "Supprimer la séance"}
          </span>
        </button>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <h2 className="font-semibold text-accent text-xs uppercase tracking-widest">
          Exercices
        </h2>

        <p className="text-base-content/75 text-sm">
          {session.exerciseCount}{" "}
          {session.exerciseCount <= 1 ? "exercice" : "exercices"}
        </p>
      </div>

      <div
        className={`mt-3 ${
          session.exerciseCount === 0
            ? "md:rounded-box md:border md:border-base-300 md:border-dashed md:bg-linear-to-b md:from-primary/10 md:to-transparent md:px-6 md:py-12"
            : ""
        }`}
      >
        {session.exerciseCount === 0 && (
          <div className="flex flex-col items-center gap-4 rounded-box border border-base-300 border-dashed bg-linear-to-b from-primary/10 to-transparent px-6 py-10 text-center md:border-0 md:bg-none md:p-0">
            <span
              aria-hidden="true"
              className="grid size-14 shrink-0 place-items-center rounded-full bg-primary/15 text-primary md:size-16"
            >
              <BarbellIcon className="size-7" />
            </span>

            <div>
              <h3 className="mb-1 font-display font-extrabold text-base-content text-xl uppercase italic md:text-2xl">
                Aucun exercice
              </h3>
              <p className="mx-auto max-w-sm text-base-content/75 text-sm leading-6">
                Ajoute au moins un exercice pour pouvoir démarrer cette séance.
              </p>
            </div>
          </div>
        )}

        <div
          className={`flex flex-col gap-3 md:flex-row ${
            session.exerciseCount === 0
              ? "mt-6 md:justify-center"
              : "md:justify-end"
          }`}
        >
          <Link
            to="/exercises"
            className={`flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 font-semibold transition focus-visible:outline-2 focus-visible:outline-info focus-visible:outline-offset-2 md:w-auto md:px-5 md:py-2.5 md:text-sm ${
              session.exerciseCount === 0
                ? "border-primary bg-primary text-primary-content hover:opacity-90"
                : "border-base-content/40 hover:border-base-content hover:bg-base-200"
            }`}
          >
            <PlusIcon aria-hidden="true" className="size-5 md:size-4" />
            Ajouter des exercices
          </Link>

          <button
            type="button"
            disabled={session.exerciseCount === 0}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary bg-primary px-4 py-3 font-semibold text-primary-content transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-info focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:border-base-300 disabled:bg-base-200 disabled:text-base-content/35 disabled:hover:opacity-100 md:w-auto md:px-5 md:py-2.5 md:text-sm"
          >
            <PlayIcon aria-hidden="true" className="size-5 md:size-4" />
            Démarrer la séance
          </button>
        </div>
      </div>
    </div>
  );
}

export default SessionId;
