import type { ExerciseDetail } from "../../types/exercise";

type MuscleListProps = {
  title: string;
  muscles: ExerciseDetail["muscles"];
};

function MuscleList({ title, muscles }: MuscleListProps) {
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

export default MuscleList;
