import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

import TrashIcon from "../assets/icons/actions/trash.svg?react";
import ChevronLeftIcon from "../assets/icons/chevrons/chevron-left.svg?react";
import BarbellIcon from "../assets/icons/navigation/barbell.svg?react";
import Chrono from "../components/Chrono";
import DeleteSessionModal from "../components/DeleteSessionModal";
import PreparedExerciseCard from "../components/PreparedExerciseCard";
import { CurrentSessionContext } from "../contexts/CurrentSessionContext";
import { useMessages } from "../contexts/MessageContext";
import { useMobileNav } from "../contexts/MobileNavContext";
import useDeletePreparedSession from "../hooks/workout-session/useDeletePreparedSession";
import useReorderSessionExercises from "../hooks/workout-session/useReorderSessionExercises";
import useStartSession from "../hooks/workout-session/useStartSession";
import useWorkoutSession from "../hooks/workout-session/useWorkoutSession";

function SessionId() {
  const { id } = useParams();
  const navigate = useNavigate();

  const sessionId = Number(id);
  const { session, loading, error, updateSessionExercises } =
    useWorkoutSession(sessionId);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    reorderSessionExercises,
    loading: reorderLoading,
    error: reorderError,
  } = useReorderSessionExercises();

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
  const { isNavOpen } = useMobileNav();
  const { showMessage } = useMessages();

  useEffect(() => {
    if (deleteError !== null) {
      showMessage(deleteError, "error");
    }
  }, [deleteError, showMessage]);

  useEffect(() => {
    if (startError !== null) {
      showMessage(startError, "error");
    }
  }, [startError, showMessage]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p>{error}</p>;
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

  const handleMoveExercise = async (
    currentIndex: number,
    direction: -1 | 1,
  ) => {
    const targetIndex = currentIndex + direction;

    if (targetIndex < 0 || targetIndex >= exercises.length) {
      return;
    }

    const nextExercises = [...exercises];

    [nextExercises[currentIndex], nextExercises[targetIndex]] = [
      nextExercises[targetIndex],
      nextExercises[currentIndex],
    ];

    const sessionExerciseIds = nextExercises.map(
      (exercise) => exercise.sessionExerciseId,
    );

    const reordered = await reorderSessionExercises(
      session.id,
      sessionExerciseIds,
    );

    if (!reordered) {
      return;
    }

    updateSessionExercises(
      nextExercises.map((exercise, index) => ({
        ...exercise,
        position: index + 1,
      })),
    );
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
    <div className="w-full max-w-3xl pb-24 md:py-4 md:pb-4 lg:px-4">
      <div className="flex items-center justify-between gap-2 border-base-300 border-b pb-4 lg:pb-6">
        <div className="flex min-w-0 items-center gap-1">
          <Link
            to="/sessions"
            aria-label="Retour aux séances"
            className="-ml-2 grid size-10 shrink-0 place-items-center rounded-full text-base-content transition-colors hover:bg-base-200 focus-visible:outline-2 focus-visible:outline-info focus-visible:outline-offset-2"
          >
            <ChevronLeftIcon aria-hidden="true" className="size-6" />
          </Link>

          <h1 className="whitespace-nowrap py-0.5 font-display font-extrabold text-2xl uppercase italic leading-snug lg:text-4xl">
            Ma séance
          </h1>
        </div>

        {isPrepared && (
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={deleteLoading}
            className="-mr-1 flex shrink-0 items-center gap-1.5 rounded-lg px-1.5 py-1.5 font-medium text-error text-sm transition-colors hover:bg-error/10 focus-visible:outline-2 focus-visible:outline-error focus-visible:outline-offset-2 disabled:cursor-wait disabled:opacity-60"
          >
            <TrashIcon aria-hidden="true" className="size-4" />
            {deleteLoading ? "Suppression..." : "Supprimer"}
          </button>
        )}

        {isInProgress && (
          <button
            type="button"
            disabled
            title="L'abandon de séance n'est pas encore disponible"
            className="-mr-1 flex shrink-0 cursor-not-allowed items-center gap-1.5 rounded-lg px-1.5 py-1.5 font-medium text-error text-sm"
          >
            <span aria-hidden="true" className="text-base leading-none">
              &times;
            </span>
            Abandonner
          </button>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 lg:mt-5">
        <p className="min-w-0 font-semibold capitalize">{formattedDate}</p>

        {isInProgress ? (
          startedAt && <Chrono startedAt={startedAt} />
        ) : (
          <span className="inline-flex shrink-0 whitespace-nowrap rounded-full bg-info/15 px-2.5 py-1 font-semibold text-[11px] text-info uppercase tracking-wide">
            Non démarrée
          </span>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <h2 className="font-semibold text-accent text-xs uppercase tracking-widest">
          Exercices
        </h2>

        <p className="text-base-content/75 text-sm">
          {exerciseCount} {exerciseCount <= 1 ? "exercice" : "exercices"}
        </p>
      </div>
      {reorderError && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-error/40 bg-error/10 px-4 py-3 text-error text-sm"
        >
          {reorderError}
        </p>
      )}
      <div
        className={`mt-3 ${
          exerciseCount === 0
            ? "md:rounded-box md:border md:border-base-300 md:border-dashed md:bg-linear-to-b md:from-primary/10 md:to-transparent md:px-6 md:py-12"
            : ""
        }`}
      >
        {exerciseCount === 0 ? (
          <Link
            to={`/sessions/${session.id}/exercises`}
            className="flex flex-col items-center gap-4 rounded-box border border-base-300 border-dashed bg-linear-to-b from-primary/10 to-transparent px-6 py-10 text-center transition-colors hover:border-primary hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-info focus-visible:outline-offset-2 md:border-0 md:bg-none md:p-0"
          >
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
                Appuie ici pour ajouter des exercices, une séance vide ne peut
                pas être démarrée.
              </p>
            </div>
          </Link>
        ) : (
          <div className="flex flex-col gap-3">
            {exercises.map((exercise, index) => (
              <PreparedExerciseCard
                key={exercise.sessionExerciseId}
                exercise={exercise}
                onMoveUp={() => handleMoveExercise(index, -1)}
                onMoveDown={() => handleMoveExercise(index, 1)}
                canMoveUp={index > 0}
                canMoveDown={index < exercises.length - 1}
                disabled={reorderLoading}
              />
            ))}
          </div>
        )}

        <div
          className={`fixed inset-x-0 bottom-0 z-10 flex items-stretch gap-3 bg-linear-to-t from-base-100 from-70% to-transparent px-4 pt-10 transition-[padding] duration-300 md:static md:mt-6 md:bg-none md:p-0 ${
            isNavOpen ? "pb-24" : "pb-9"
          } ${exerciseCount === 0 ? "md:justify-center" : "md:justify-end"}`}
        >
          <Link
            to={`/sessions/${session.id}/exercises`}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-center font-semibold text-xs leading-tight transition focus-visible:outline-2 focus-visible:outline-info focus-visible:outline-offset-2 sm:text-sm md:flex-none md:px-5 ${
              exerciseCount === 0
                ? "border-primary bg-primary text-primary-content hover:opacity-90"
                : "border-base-content/40 bg-base-100 hover:border-base-content hover:bg-base-200 md:bg-transparent"
            }`}
          >
            Ajouter des exercices
          </Link>

          {isPrepared && (
            <button
              type="button"
              onClick={handleStart}
              disabled={exerciseCount === 0 || startLoading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-primary bg-primary px-3 py-2.5 text-center font-semibold text-primary-content text-xs leading-tight transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-info focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:border-base-300 disabled:bg-base-200 disabled:text-base-content/35 disabled:hover:opacity-100 sm:text-sm md:flex-none md:px-5"
            >
              {startLoading ? "Démarrage..." : "Démarrer la séance"}
            </button>
          )}
        </div>
      </div>

      {isPrepared && isDeleteModalOpen && (
        <DeleteSessionModal
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />
      )}
      {currentSessionId !== null && currentSessionId !== session.id && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-base-100/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-box border border-base-300 bg-base-200 p-6 shadow-2xl">
            <h2 className="font-display font-extrabold text-xl uppercase italic">
              Séance déjà en cours
            </h2>

            <p className="mt-2 text-base-content/75">
              Vous avez déjà une séance en cours.
            </p>

            <button
              type="button"
              onClick={() => navigate(`/sessions/${currentSessionId}`)}
              className="mt-5 w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-content"
            >
              Reprendre la séance
            </button>

            <button
              type="button"
              disabled
              className="mt-3 w-full cursor-not-allowed rounded-lg border border-base-300 px-4 py-3 font-semibold opacity-40"
            >
              Abandonner la séance
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SessionId;
