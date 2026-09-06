import useExercises from "../hooks/useExercises";

function ExercisesPage() {
  const { exercises, isLoading, error, retry } = useExercises();

  if (isLoading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return (
      <>
        <p>Impossible de charger les exercices</p>
        <button onClick={retry}>Réessayer</button>
      </>
    );
  }

  if (exercises.length === 0) {
    return <p>Aucun exercice n'est disponible pour le moment.</p>;
  }

  return (
    <h1 className="text-2xl font-display italic font-extrabold uppercase">
      Exercices {exercises.length}
    </h1>
  );
}

export default ExercisesPage;
