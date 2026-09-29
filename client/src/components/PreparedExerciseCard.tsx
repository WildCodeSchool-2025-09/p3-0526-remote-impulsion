import ChevronDownIcon from "../assets/icons/chevrons/chevron-down.svg?react";
import ChevronUpIcon from "../assets/icons/chevrons/chevron-up.svg?react";
import type { WorkoutSessionExercise } from "../types/workoutSession";

type PreparedExerciseCardProps = {
  exercise: WorkoutSessionExercise;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  disabled: boolean;
};

function PreparedExerciseCard({
  exercise,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  disabled,
}: PreparedExerciseCardProps) {
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

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp || disabled}
            aria-label={`Monter ${exercise.name}`}
            className="grid size-9 place-items-center rounded-lg border border-base-300 text-base-content transition hover:border-primary hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronUpIcon aria-hidden="true" className="size-4" />
          </button>

          <button
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown || disabled}
            aria-label={`Descendre ${exercise.name}`}
            className="grid size-9 place-items-center rounded-lg border border-base-300 text-base-content transition hover:border-primary hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronDownIcon aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default PreparedExerciseCard;
