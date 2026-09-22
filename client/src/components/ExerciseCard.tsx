import type { ExerciseSummary } from "../types/exercise";

type ExerciseCardProps = {
  exercise: ExerciseSummary;
  onSelect: (id: number) => void;
  selectionMode?: boolean;
  isSelected?: boolean;
  isUnavailable?: boolean;
  onToggleSelect?: (id: number) => void;
};

function ExerciseCard({
  exercise,
  onSelect,
  selectionMode,
  isSelected,
  isUnavailable,
  onToggleSelect,
}: ExerciseCardProps) {
  if (!selectionMode) {
    return (
      <button
        type="button"
        onClick={() => onSelect(exercise.id)}
        className="group flex w-full items-center gap-3 rounded-xl border border-base-300 bg-base-200 p-3 text-left transition hover:border-primary/60 hover:bg-base-300 focus-visible:outline-2 focus-visible:outline-info focus-visible:outline-offset-2"
      >
        <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-white">
          <img
            src={`${import.meta.env.VITE_API_URL}${exercise.imageUrl}`}
            alt={exercise.name}
            className="size-full object-contain"
            onError={(event) => {
              event.currentTarget.src = `${import.meta.env.VITE_API_URL}/assets/images/placeholder-exercise.png`;
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate font-body font-bold text-base-content text-sm">
            {exercise.name}
          </h2>
          <p className="mt-1 truncate text-neutral text-xs">
            {exercise.category}
          </p>
        </div>

        <span
          aria-hidden="true"
          className="shrink-0 text-xl text-neutral transition group-hover:text-primary"
        >
          ›
        </span>
      </button>
    );
  }

  return (
    <div
      className={`flex w-full items-center gap-3 rounded-xl border bg-base-200 px-3 py-2.5 transition ${
        isSelected ? "border-primary ring-2 ring-primary/30" : "border-base-300"
      } ${isUnavailable ? "opacity-55" : ""}`}
    >
      {selectionMode && (
        <button
          type="button"
          onClick={() => onToggleSelect?.(exercise.id)}
          disabled={isUnavailable}
          aria-pressed={isSelected}
          aria-label={
            isUnavailable
              ? "Exercice déjà ajouté à la séance"
              : isSelected
                ? "Désélectionner cet exercice"
                : "Sélectionner cet exercice"
          }
          className={`grid size-6 shrink-0 place-items-center rounded-full border-2 font-bold text-xs transition ${
            isSelected
              ? "border-primary bg-primary text-primary-content"
              : "border-base-content/40 bg-base-100"
          } disabled:cursor-not-allowed`}
        >
          {isSelected && <span aria-hidden="true">✓</span>}
        </button>
      )}

      <button
        type="button"
        onClick={() => onSelect(exercise.id)}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <img
          src={`${import.meta.env.VITE_API_URL}${exercise.imageUrl}`}
          alt=""
          loading="lazy"
          className="h-14 w-20 shrink-0 rounded-lg bg-base-100 object-contain"
          onError={(event) => {
            event.currentTarget.src = `${import.meta.env.VITE_API_URL}/assets/images/placeholder-exercise.png`;
          }}
        />

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-base-content text-sm">
            {exercise.name}
          </p>
          <span className="badge badge-sm mt-1">
            {isUnavailable ? "Déjà ajouté" : exercise.category}
          </span>
        </div>
      </button>
    </div>
  );
}

export default ExerciseCard;
