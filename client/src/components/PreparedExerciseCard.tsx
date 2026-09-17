import type { WorkoutSessionExercise } from "../types/workoutSession";

type PreparedExerciseCardProps = {
  exercise: WorkoutSessionExercise;
};

function PreparedExerciseCard({ exercise }: PreparedExerciseCardProps) {
  return (
    <article className="rounded-box border border-base-300 bg-base-200 p-4">
      <div className="flex items-start gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary/15 font-bold text-secondary text-sm">
          {exercise.position}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-base-content">{exercise.name}</h3>
          <p className="mt-1 text-neutral text-sm">{exercise.category}</p>
        </div>

        <span className="rounded-full bg-base-300 px-2.5 py-1 text-neutral text-xs">
          À préparer
        </span>
      </div>
    </article>
  );
}

export default PreparedExerciseCard;
