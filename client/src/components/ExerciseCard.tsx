import type { ExerciseSummary } from "../types/exercise";

function ExerciseCard({ exercise }: { exercise: ExerciseSummary }) {
  return (
    <button
      type="button"
      // TODO US10: ouvrir la modale de la fiche exercice
      onClick={() => {}}
      className="flex w-full flex-col items-start gap-2 rounded-box border border-base-300 bg-base-200 p-3 text-left"
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
  );
}

export default ExerciseCard;
