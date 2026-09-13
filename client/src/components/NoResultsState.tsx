function NoResultsState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-start gap-2">
      <p>Aucun exercice ne correspond à votre recherche.</p>
      <button type="button" onClick={onReset} className="btn btn-sm">
        Réinitialiser les filtres
      </button>
    </div>
  );
}

export default NoResultsState;
