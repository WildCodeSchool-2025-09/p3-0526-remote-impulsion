const HistoryTabs = () => {
  return (
    <nav className="mt-4 grid grid-cols-2 border-base-300 border-b">
      <button
        type="button"
        aria-current="page"
        className="-mb-px border-secondary border-b-2 pb-3 font-display font-extrabold text-secondary text-sm uppercase italic"
      >
        Séances
      </button>
      <button
        type="button"
        disabled
        title="Disponible à partir de l'US29"
        className="-mb-px border-transparent border-b-2 pb-3 font-display font-extrabold text-base-content/40 text-sm uppercase italic disabled:cursor-not-allowed"
      >
        Progression
      </button>
    </nav>
  );
};

export default HistoryTabs;
