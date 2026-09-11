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
    <div className="space-y-5" aria-label="Chargement de la fiche exercice">
      <Skeleton className="h-36 w-full sm:h-44" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        {["step-one", "step-two", "step-three", "step-four"].map((step) => (
          <div key={step} className="flex items-center gap-3">
            <Skeleton className="size-6 shrink-0 rounded-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

function getInstructionSteps(description: string) {
  return description
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/^\d+\.\s*/, ""))
    .filter(Boolean);
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
  const instructionSteps = getInstructionSteps(exercise.description);

  return (
    <div className="space-y-5">
      <img
        src={`${import.meta.env.VITE_API_URL}${exercise.imageUrl}`}
        alt={`Illustration de ${exercise.name}`}
        className="h-36 w-full rounded-field border border-base-300 bg-white object-contain sm:h-44"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = `${import.meta.env.VITE_API_URL}/assets/images/placeholder-exercise.png`;
        }}
      />

      <section className="space-y-3" aria-labelledby="instructions-title">
        <h3
          id="instructions-title"
          className="font-semibold text-accent text-xs uppercase tracking-[0.18em]"
        >
          Exécution
        </h3>
        <ol className="space-y-3">
          {instructionSteps.map((instruction, index) => (
            <li key={instruction} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="grid size-6 shrink-0 place-items-center rounded-full bg-secondary/20 font-semibold text-info text-xs"
              >
                {index + 1}
              </span>
              <span className="pt-0.5 text-base-content/75 text-sm leading-5">
                {instruction}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="space-y-3 border-base-300 border-t pt-5"
        aria-labelledby="muscles-title"
      >
        <h3
          id="muscles-title"
          className="font-semibold text-accent text-xs uppercase tracking-[0.18em]"
        >
          Muscles sollicités
        </h3>
        <MuscleList title="Principaux" muscles={primaryMuscles} />
        <MuscleList title="Secondaires" muscles={secondaryMuscles} />
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
  const dialogRef = useRef<HTMLDialogElement>(null);

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
        return;
      }

      if (event.key !== "Tab" || dialogRef.current === null) {
        return;
      }

      const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement =
        focusableElements[focusableElements.length - 1];

      if (
        firstFocusableElement === undefined ||
        lastFocusableElement === undefined
      ) {
        return;
      }

      if (event.shiftKey && document.activeElement === firstFocusableElement) {
        event.preventDefault();
        lastFocusableElement.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === lastFocusableElement
      ) {
        event.preventDefault();
        firstFocusableElement.focus();
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
        ref={dialogRef}
        open
        aria-modal="true"
        aria-labelledby="exercise-detail-title"
        className="relative z-10 m-0 flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[2rem] border-base-300 border-t bg-base-200 p-0 text-base-content shadow-2xl md:h-dvh md:max-h-dvh md:max-w-xl md:rounded-none md:border-t-0 md:border-l"
      >
        <div
          aria-hidden="true"
          className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-base-content/20 md:hidden"
        />

        <header className="flex shrink-0 items-start justify-between gap-4 border-base-300 border-b px-5 py-4 md:px-7 md:py-6">
          <div className="min-w-0">
            <h2
              id="exercise-detail-title"
              className="font-display font-extrabold text-2xl text-base-content uppercase italic leading-none md:text-3xl"
            >
              {exerciseDetail?.name ?? "Exercice"}
            </h2>
            {exerciseDetail !== null && (
              <p className="mt-2 flex flex-wrap items-center gap-x-2 text-neutral text-xs">
                <span>{exerciseDetail.category}</span>
                <span aria-hidden="true">·</span>
                <span>
                  {exerciseDetail.equipment.length === 0
                    ? "Sans matériel"
                    : exerciseDetail.equipment
                        .map((item) => item.name)
                        .join(", ")}
                </span>
                <span aria-hidden="true">·</span>
                <span>{exerciseDetail.difficulty}</span>
              </p>
            )}
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

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 md:px-7 md:py-6">
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
