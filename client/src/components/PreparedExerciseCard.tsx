import type { WorkoutSessionExercise } from "../types/workoutSession";

type PreparedExerciseCardProps = {
  exercise: WorkoutSessionExercise;
};

function PreparedExerciseCard({ exercise }: PreparedExerciseCardProps) {
  return (
    <article className="rounded-box border border-base-300 bg-linear-to-b from-base-300/35 to-base-200 p-4 transition-colors hover:border-primary/40">
      <div className="flex items-start gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary/20 font-display font-extrabold text-base text-secondary italic ring-1 ring-secondary/30">
          {exercise.position}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-base-content">{exercise.name}</h3>
          <p className="mt-1 text-neutral text-sm">{exercise.category}</p>
        </div>

        <span className="shrink-0 rounded-full border border-base-300 px-2.5 py-1 text-neutral text-xs">
          À préparer
        </span>
      </div>
    </article>
  );
}

export default PreparedExerciseCard;
