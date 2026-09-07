import useExercises from "../hooks/useExercises";
import ExerciseCard from "../components/ExerciseCard";
import ExerciseCardSkeleton from "../components/ExerciseCardSkeleton";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";

function ExercisesPage() {
  const { exercises, isLoading, error, retry } = useExercises();

  if (isLoading) {
    return (
      <div>
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
      <article>
        {exercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </article>
    </section>
  );
}

export default ExercisesPage;
