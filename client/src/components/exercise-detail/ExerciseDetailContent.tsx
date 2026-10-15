import type { ExerciseDetail } from "../../types/exercise";
import MuscleList from "./MuscleList";

type ExerciseDetailContentProps = {
  exercise: ExerciseDetail;
};

function getInstructionSteps(description: string) {
  return description
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/^\d+\.\s*/, ""))
    .filter(Boolean);
}

function ExerciseDetailContent({ exercise }: ExerciseDetailContentProps) {
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

export default ExerciseDetailContent;
