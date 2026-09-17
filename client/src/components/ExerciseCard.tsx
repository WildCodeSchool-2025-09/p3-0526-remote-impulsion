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
  return (
    <div
      className={`relative flex w-full flex-col items-start gap-2 rounded-box border bg-base-200 p-3 transition ${
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
          className={`absolute right-3 top-3 z-10 grid size-7 place-items-center rounded-full border-2 font-bold text-xs transition ${
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
        className="flex w-full flex-col items-start gap-2 text-left"
      >
        <img
          src={`${import.meta.env.VITE_API_URL}${exercise.imageUrl}`}
          alt={exercise.name}
          className={`w-full rounded-field object-cover ${
            selectionMode ? "aspect-[4/3]" : "aspect-square"
          }`}
          onError={(event) => {
            event.currentTarget.src = `${import.meta.env.VITE_API_URL}/assets/images/placeholder-exercise.png`;
          }}
        />
        <h2 className="font-body text-sm font-semibold text-base-content">
          {exercise.name}
        </h2>
        <span className="badge badge-sm">
          {isUnavailable ? "Déjà ajouté" : exercise.category}
        </span>
      </button>
    </div>
  );
}

export default ExerciseCard;
