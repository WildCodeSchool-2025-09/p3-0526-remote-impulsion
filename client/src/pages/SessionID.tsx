import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

import PlayIcon from "../assets/icons/actions/play-circle.svg?react";
import PlusIcon from "../assets/icons/actions/plus.svg?react";
import TrashIcon from "../assets/icons/actions/trash.svg?react";
import ArrowRightIcon from "../assets/icons/arrows/arrow-right.svg?react";
import BarbellIcon from "../assets/icons/navigation/barbell.svg?react";
import PreparedExerciseCard from "../components/PreparedExerciseCard";
import Chrono from "../components/Chrono";
import ConfirmModal from "../components/ConfirmModal";
import { CurrentSessionContext } from "../contexts/CurrentSessionContext";
import useDeletePreparedSession from "../hooks/workout-session/useDeletePreparedSession";
import useStartSession from "../hooks/workout-session/useStartSession";
import useWorkoutSession from "../hooks/workout-session/useWorkoutSession";

function SessionId() {
  const { id } = useParams();
  const navigate = useNavigate();

  const sessionId = Number(id);
  const { session, loading, error } = useWorkoutSession(sessionId);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    deletePreparedSession,
    loading: deleteLoading,
    error: deleteError,
  } = useDeletePreparedSession();

  const {
    startSession,
    loading: startLoading,
    error: startError,
    currentSessionId,
  } = useStartSession();

  const currentSessionContext = useContext(CurrentSessionContext);

  useEffect(() => {
    if (currentSessionId !== null) {
      navigate(`/sessions/${currentSessionId}`);
    }
  }, [currentSessionId, navigate]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error || deleteError || startError) {
    return <p>{error || deleteError || startError}</p>;
  }

  if (!session) {
    return <p>Séance introuvable.</p>;
  }

  const formattedDate = new Date(session.createdAt).toLocaleDateString(
    "fr-FR",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
    },
  );
  const exercises = session.exercises ?? [];
  const exerciseCount = Number(session.exerciseCount);

  const handleDelete = async () => {
    const deleted = await deletePreparedSession(session.id);

    if (deleted) {
      navigate("/sessions");
    }
  };

  const handleStart = async () => {
    const started = await startSession(session.id);

    if (started && currentSessionContext) {
      await currentSessionContext.refreshCurrentSession();
    }
  };

  const isInProgress =
    session.status === "in_progress" ||
    currentSessionContext?.currentSession?.id === session.id;

  const isPrepared = session.status === "prepared" && !isInProgress;

  const startedAt =
    currentSessionContext?.currentSession?.id === session.id
      ? currentSessionContext.currentSession.startedAt
      : session.startedAt;

  return (
    <div className="w-full max-w-3xl md:py-4 lg:px-4">
      <div className="flex items-center justify-between gap-2 lg:border-base-300 lg:border-b lg:pb-6">
        <div className="flex min-w-0 items-center gap-2">
          <Link
            to="/sessions"
            aria-label="Retour aux séances"
            className="grid size-10 shrink-0 place-items-center rounded-full text-base-content transition-colors hover:bg-base-200 focus-visible:outline-2 focus-visible:outline-info focus-visible:outline-offset-2"
          >
            <ArrowRightIcon aria-hidden="true" className="size-5 rotate-180" />
          </Link>

          <h1 className="font-display font-extrabold text-2xl uppercase italic lg:text-4xl">
            {isInProgress ? "Séance en cours" : "Séance préparée"}
          </h1>
        </div>

        {isPrepared && (
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={deleteLoading}
            className="-my-2 -mr-2 grid size-10 shrink-0 place-items-center rounded-full text-error transition-colors hover:bg-error/15 focus-visible:outline-2 focus-visible:outline-error focus-visible:outline-offset-2 disabled:cursor-wait disabled:opacity-60 lg:m-0 lg:flex lg:size-auto lg:gap-2 lg:rounded-lg lg:border lg:border-error/50 lg:px-4 lg:py-2 lg:font-semibold lg:text-sm lg:hover:bg-error/10"
          >
            <TrashIcon aria-hidden="true" className="size-5 lg:size-4" />

            <span className="sr-only lg:not-sr-only">
              {deleteLoading ? "Suppression..." : "Supprimer la séance"}
            </span>
          </button>
        )}
        {isInProgress && startedAt && <Chrono startedAt={startedAt} />}
      </div>

      <div className="mt-5 flex items-start justify-between gap-4 border-base-300 border-b pb-5">
        <div>
          <p className="font-semibold capitalize">{formattedDate}</p>
          <span className="mt-2 inline-flex rounded-full bg-info/15 px-2.5 py-1 font-semibold text-info text-xs uppercase tracking-wide">
            Préparée · non démarrée
          </span>
        </div>

        <p className="max-w-36 text-right text-neutral text-xs leading-5">
          Le chrono démarrera au lancement
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <h2 className="font-semibold text-accent text-xs uppercase tracking-widest">
          Exercices
        </h2>

        <p className="text-base-content/75 text-sm">
          {exerciseCount} {exerciseCount <= 1 ? "exercice" : "exercices"}
        </p>
      </div>

      <div
        className={`mt-3 ${
          exerciseCount === 0
            ? "md:rounded-box md:border md:border-base-300 md:border-dashed md:bg-linear-to-b md:from-primary/10 md:to-transparent md:px-6 md:py-12"
            : ""
        }`}
      >
        {exerciseCount === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-box border border-base-300 border-dashed bg-linear-to-b from-primary/10 to-transparent px-6 py-10 text-center md:border-0 md:bg-none md:p-0">
            <span
              aria-hidden="true"
              className="grid size-14 shrink-0 place-items-center rounded-full bg-primary/15 text-primary md:size-16"
            >
              <BarbellIcon className="size-7" />
            </span>

            <div>
              <h3 className="mb-1 font-display font-extrabold text-base-content text-xl uppercase italic md:text-2xl">
                Ajoutez votre premier exercice
              </h3>

              <p className="mx-auto max-w-sm text-base-content/75 text-sm leading-6">
                Une séance vide ne peut pas être démarrée.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {exercises.map((exercise) => (
              <PreparedExerciseCard
                key={exercise.sessionExerciseId}
                exercise={exercise}
              />
            ))}
          </div>
        )}

        <div
          className={`flex flex-col gap-3 md:flex-row ${
            exerciseCount === 0
              ? "mt-6 md:justify-center"
              : "mt-6 md:justify-end"
          }`}
        >
          <Link
            to={`/sessions/${session.id}/exercises`}
            className={`flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 font-semibold transition focus-visible:outline-2 focus-visible:outline-info focus-visible:outline-offset-2 md:w-auto md:px-5 md:py-2.5 md:text-sm ${
              exerciseCount === 0
                ? "border-primary bg-primary text-primary-content hover:opacity-90"
                : "border-base-content/40 hover:border-base-content hover:bg-base-200"
            }`}
          >
            <PlusIcon aria-hidden="true" className="size-5 md:size-4" />
            Ajouter des exercices
          </Link>

          {isPrepared && (
            <button
              type="button"
              onClick={handleStart}
              disabled={exerciseCount === 0 || startLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary bg-primary px-4 py-3 font-semibold text-primary-content transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-info focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:border-base-300 disabled:bg-base-200 disabled:text-base-content/35 disabled:hover:opacity-100 md:w-auto md:px-5 md:py-2.5 md:text-sm"
            >
              <PlayIcon aria-hidden="true" className="size-5 md:size-4" />

              {startLoading ? "Démarrage..." : "Démarrer la séance"}
            </button>
          )}
        </div>
      </div>

      {isPrepared && isDeleteModalOpen && (
        <ConfirmModal
          title="Supprimer cette séance ?"
          message="Cette séance préparée sera définitivement supprimée."
          confirmLabel="Supprimer"
          cancelLabel="Conserver"
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

export default SessionId;
