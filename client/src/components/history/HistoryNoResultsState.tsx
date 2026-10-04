type HistoryNoResultsStateProps = {
  onReset: () => void;
};

function HistoryNoResultsState({ onReset }: HistoryNoResultsStateProps) {
  return (
    <div className="mt-6 flex flex-col items-start gap-3 rounded-box border border-base-300 border-dashed p-6">
      <p className="text-base-content/75 text-sm leading-6">
        Aucune séance sur cette période.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="rounded-field bg-base-200 px-4 py-2 font-semibold text-base-content text-sm transition-colors hover:bg-base-300 focus-visible:outline-2 focus-visible:outline-info focus-visible:outline-offset-2"
      >
        Voir toutes les séances
      </button>
    </div>
  );
}

export default HistoryNoResultsState;
