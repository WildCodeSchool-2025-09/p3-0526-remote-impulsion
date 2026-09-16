import type { ExerciseSummary } from "../types/exercise";

type ExerciseCardProps = {
  exercise: ExerciseSummary;
  onSelect: (id: number) => void;
  selectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: number) => void;
};

function ExerciseCard({
  exercise,
  onSelect,
  selectionMode,
  isSelected,
  onToggleSelect,
}: ExerciseCardProps) {
  return (
    <div className="relative flex w-full flex-col items-start gap-2 rounded-box border border-base-300 bg-base-200 p-3">
      {selectionMode && (
        <button
          type="button"
          onClick={() => onToggleSelect?.(exercise.id)}
          aria-pressed={isSelected}
          aria-label={
            isSelected
              ? "Désélectionner cet exercice"
              : "Sélectionner cet exercice"
          }
          className={`absolute right-3 top-3 z-10 h-6 w-6 rounded border-2 ${
            isSelected
              ? "border-primary bg-primary"
              : "border-base-content/40 bg-base-100"
          }`}
        />
      )}

      <button
        type="button"
        onClick={() => onSelect(exercise.id)}
        className="flex w-full flex-col items-start gap-2 text-left"
      >
        <img
          src={`${import.meta.env.VITE_API_URL}${exercise.imageUrl}`}
          alt={exercise.name}
          className="aspect-square w-full rounded-field object-cover"
          onError={(event) => {
            event.currentTarget.src = `${import.meta.env.VITE_API_URL}/assets/images/placeholder-exercise.png`;
          }}
        />
        <h2 className="font-body text-sm font-semibold text-base-content">
          {exercise.name}
        </h2>
        <span className="badge badge-sm">{exercise.category}</span>
      </button>
    </div>
  );
}

export default ExerciseCard;
