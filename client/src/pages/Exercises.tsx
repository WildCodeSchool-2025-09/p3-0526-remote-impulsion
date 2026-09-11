import { useState } from "react";
import EmptyState from "../components/EmptyState";
import ExerciseCard from "../components/ExerciseCard";
import ExerciseCardSkeleton from "../components/ExerciseCardSkeleton";
import ExerciseDetailSheet from "../components/ExerciseDetailSheet";
import LocalErrorState from "../components/feedback/LocalErrorState";
import useExercises from "../hooks/useExercises";

function Exercises() {
  const { exercises, isLoading, error, retry } = useExercises();
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(
    null,
  );

  function handleOpenExerciseDetail(exerciseId: number) {
    setSelectedExerciseId(exerciseId);
  }

  function handleCloseExerciseDetail() {
    setSelectedExerciseId(null);
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 6 }).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeletons identiques et statiques, pas de réordonnancement possible
          <ExerciseCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <LocalErrorState
        message="Impossible de charger les exercices."
        onRetry={retry}
      />
    );
  }

  if (exercises.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <section>
        <h1 className="text-2xl font-display italic font-extrabold uppercase">
          Exercices {exercises.length}
        </h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onSelect={handleOpenExerciseDetail}
            />
          ))}
        </div>
        <ExerciseDetailSheet
          exerciseId={selectedExerciseId}
          onClose={handleCloseExerciseDetail}
        />
      </section>
    </>
  );
}

export default Exercises;
