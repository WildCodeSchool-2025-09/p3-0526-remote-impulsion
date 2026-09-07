import ExerciseCard from "../components/ExerciseCard";
import ExerciseCardSkeleton from "../components/ExerciseCardSkeleton";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import useExercises from "../hooks/useExercises";

function ExercisesPage() {
  const { exercises, isLoading, error, retry } = useExercises();

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
    return <ErrorState retry={retry} />;
  }

  if (exercises.length === 0) {
    return <EmptyState />;
  }

  return (
    <section>
      <h1 className="text-2xl font-display italic font-extrabold uppercase">
        Exercices {exercises.length}
      </h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {exercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </section>
  );
}

export default ExercisesPage;
