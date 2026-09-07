import useExercises from "../hooks/useExercises";
import ExerciseCard from "../components/ExerciseCard";
import ExerciseCardSkeleton from "../components/ExerciseCardSkeleton";

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
    return (
      <>
        <p>Impossible de charger les exercices</p>
        <button type="button" onClick={retry}>
          Réessayer
        </button>
      </>
    );
  }

  if (exercises.length === 0) {
    return <p>Aucun exercice n'est disponible pour le moment.</p>;
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
