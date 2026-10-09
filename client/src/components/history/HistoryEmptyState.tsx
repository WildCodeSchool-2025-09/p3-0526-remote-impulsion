import HistoryIcon from "../../assets/icons/navigation/history.svg?react";

function HistoryEmptyState() {
  return (
    <div className="mt-6 flex flex-col items-center gap-4 rounded-box border border-base-300 border-dashed bg-linear-to-b from-primary/10 to-transparent px-6 py-10 text-center">
      <span
        aria-hidden="true"
        className="grid size-14 place-items-center rounded-full bg-primary/15 text-primary"
      >
        <HistoryIcon className="size-7" />
      </span>

      <p className="max-w-md text-base-content/75 text-sm leading-6">
        <span className="mb-1 block font-display font-extrabold text-base-content text-xl uppercase italic">
          Aucune séance terminée pour l'instant.
        </span>
        Termine une séance pour la retrouver ici.
      </p>
    </div>
  );
}

export default HistoryEmptyState;
