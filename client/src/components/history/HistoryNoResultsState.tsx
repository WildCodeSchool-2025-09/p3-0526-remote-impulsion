import SearchIcon from "../../assets/icons/etats/info-circle.svg?react";

type HistoryNoResultsStateProps = {
  onReset: () => void;
};

function HistoryNoResultsState({ onReset }: HistoryNoResultsStateProps) {
  return (
    <div className="mt-6 flex flex-col items-center gap-4 rounded-box border border-base-300 border-dashed bg-linear-to-b from-base-200/50 to-transparent px-6 py-10 text-center">
      <span
        aria-hidden="true"
        className="grid size-14 place-items-center rounded-full bg-base-300/60 text-base-content/60"
      >
        <SearchIcon className="size-7" />
      </span>

      <p className="max-w-md text-base-content/75 text-sm leading-6">
        <span className="mb-1 block font-display font-extrabold text-base-content text-xl uppercase italic">
          Aucune séance sur cette période.
        </span>
        Essaie une autre période, ou reviens à l'historique complet.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="rounded-field bg-secondary px-4 py-2 font-semibold text-secondary-content text-sm transition-colors hover:bg-secondary/90 focus-visible:outline-2 focus-visible:outline-info focus-visible:outline-offset-2"
      >
        Voir toutes les séances
      </button>
    </div>
  );
}

export default HistoryNoResultsState;
