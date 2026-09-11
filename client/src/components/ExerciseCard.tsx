import type { ExerciseSummary } from "../types/exercise";

type ExerciseCardProps = {
  exercise: ExerciseSummary;
  onSelect: (exerciseId: number) => void;
};

function ExerciseCard({ exercise, onSelect }: ExerciseCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(exercise.id)}
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
