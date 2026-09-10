import { useEffect, useRef } from "react";
import useExerciseDetail from "../hooks/useExerciseDetail";
import type { ExerciseDetail } from "../types/exercise";
import LocalErrorState from "./feedback/LocalErrorState";
import Skeleton from "./feedback/Skeleton";

type ExerciseDetailSheetProps = {
  exerciseId: number | null;
  onClose: () => void;
};

function ExerciseDetailSkeleton() {
  return (
    <div className="space-y-6" aria-label="Chargement de la fiche exercice">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-20" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}

function MuscleList({
  title,
  muscles,
}: {
  title: string;
  muscles: ExerciseDetail["muscles"];
}) {
  if (muscles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-base-content text-sm">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {muscles.map((muscle) => (
          <span
            key={muscle.muscleGroupId}
            className="rounded-selector border border-primary/30 bg-primary/10 px-3 py-1 text-primary text-sm"
          >
            {muscle.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function ExerciseDetailContent({ exercise }: { exercise: ExerciseDetail }) {
  const primaryMuscles = exercise.muscles.filter(
    (muscle) => muscle.role === "primary",
  );
  const secondaryMuscles = exercise.muscles.filter(
    (muscle) => muscle.role === "secondary",
  );

  return (
    <div className="space-y-6">
      <img
        src={`${import.meta.env.VITE_API_URL}${exercise.imageUrl}`}
        alt={`Illustration de ${exercise.name}`}
        className="aspect-[4/3] w-full rounded-box bg-base-300 object-cover"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = `${import.meta.env.VITE_API_URL}/assets/images/placeholder-exercise.png`;
        }}
      />

      <div className="flex flex-wrap gap-2">
        <span className="badge badge-primary badge-outline">
          {exercise.category}
        </span>
        <span className="badge badge-neutral">{exercise.difficulty}</span>
      </div>

      <section className="space-y-3" aria-labelledby="equipment-title">
        <h3
          id="equipment-title"
          className="font-display font-bold text-base-content text-lg uppercase"
        >
          Matériel nécessaire
        </h3>
        {exercise.equipment.length === 0 ? (
          <p className="text-base-content/70 text-sm">Aucun matériel</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {exercise.equipment.map((item) => (
              <span
                key={item.equipmentId}
                className="rounded-selector bg-base-300 px-3 py-1 text-base-content text-sm"
              >
                {item.name}
              </span>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4" aria-labelledby="muscles-title">
        <h3
          id="muscles-title"
          className="font-display font-bold text-base-content text-lg uppercase"
        >
          Muscles sollicités
        </h3>
        <MuscleList title="Principaux" muscles={primaryMuscles} />
        <MuscleList title="Secondaires" muscles={secondaryMuscles} />
      </section>

      <section className="space-y-3" aria-labelledby="description-title">
        <h3
          id="description-title"
          className="font-display font-bold text-base-content text-lg uppercase"
        >
          Instructions
        </h3>
        <p className="whitespace-pre-line text-base-content/80 text-sm leading-6">
          {exercise.description}
        </p>
      </section>
    </div>
  );
}

function ExerciseDetailSheet({
  exerciseId,
  onClose,
}: ExerciseDetailSheetProps) {
  const { exerciseDetail, isLoading, error, notFound, retry } =
    useExerciseDetail(exerciseId);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (exerciseId === null) {
      return;
    }

    const previouslyFocusedElement = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;

      if (previouslyFocusedElement instanceof HTMLElement) {
        previouslyFocusedElement.focus();
      }
    };
  }, [exerciseId, onClose]);

  if (exerciseId === null) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 backdrop-blur-sm md:items-stretch md:justify-end">
      <button
        type="button"
        tabIndex={-1}
        aria-label="Fermer la fiche exercice"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <dialog
        open
        aria-modal="true"
        aria-labelledby="exercise-detail-title"
        className="relative z-10 m-0 flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[2rem] border-base-300 border-t bg-base-200 p-0 text-base-content shadow-2xl md:max-h-none md:max-w-xl md:rounded-none md:border-t-0 md:border-l"
      >
        <div
          aria-hidden="true"
          className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-base-content/20 md:hidden"
        />

        <header className="flex items-start justify-between gap-4 border-base-300 border-b px-5 py-4 md:px-7 md:py-6">
          <div className="min-w-0">
            <p className="mb-1 font-semibold text-primary text-xs uppercase tracking-[0.18em]">
              Fiche exercice
            </p>
            <h2
              id="exercise-detail-title"
              className="truncate font-display font-extrabold text-2xl text-base-content uppercase italic md:text-3xl"
            >
              {exerciseDetail?.name ?? "Exercice"}
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Fermer la fiche exercice"
            onClick={onClose}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-base-300 text-2xl text-base-content transition-colors hover:bg-primary hover:text-primary-content focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
          >
            &times;
          </button>
        </header>

        <div className="overflow-y-auto px-5 py-6 md:px-7">
          {isLoading && <ExerciseDetailSkeleton />}

          {!isLoading && error !== null && (
            <LocalErrorState
              message="Impossible de charger cet exercice."
              onRetry={retry}
            />
          )}

          {!isLoading && error === null && notFound && (
            <div
              aria-live="polite"
              className="rounded-box border border-base-300 bg-base-100 p-8 text-center"
            >
              <p className="font-display font-bold text-base-content text-xl uppercase">
                Cet exercice n’existe pas.
              </p>
            </div>
          )}

          {!isLoading &&
            error === null &&
            !notFound &&
            exerciseDetail !== null && (
              <ExerciseDetailContent exercise={exerciseDetail} />
            )}
        </div>
      </dialog>
    </div>
  );
}

export default ExerciseDetailSheet;
