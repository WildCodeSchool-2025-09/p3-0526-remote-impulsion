function ErrorState({ retry }: { retry: () => void }) {
  return (
    <>
      <p>Impossible de charger les exercices.</p>
      <button type="button" onClick={retry}>
        Réessayer
      </button>
    </>
  );
}

export default ErrorState;
