```tsx
import { useState } from "react";
import EmptyState from "../components/EmptyState";
import ExerciseCard from "../components/ExerciseCard";
import ExerciseCardSkeleton from "../components/ExerciseCardSkeleton";
import FilterPanel from "../components/FilterPanel";
import NoResultsState from "../components/NoResultsState";
import SearchField from "../components/SearchField";
import LocalErrorState from "../components/feedback/LocalErrorState";
import useExercises from "../hooks/useExercises";
import useFilters from "../hooks/useFilters";

type OpenPanel = "category" | "equipment" | "difficulty" | null;

function Exercises() {
  const {
    exercises,
    isLoading,
    error,
    retry,
    search,
    setSearch,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedEquipmentId,
    setSelectedEquipmentId,
    selectedDifficultyId,
    setSelectedDifficultyId,
    hasActiveFilter,
    resetFilters,
    isCatalogEmpty,
  } = useExercises();

  const {
    categories,
    difficulties,
    equipment,
    error: filtersError,
  } = useFilters();

  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);

  function togglePanel(panel: OpenPanel) {
    setOpenPanel((current) => (current === panel ? null : panel));
  }

  if (error) {
    return (
      <section className="min-h-full bg-[#0F172A] px-4 py-6">
        <LocalErrorState
          message="Impossible de charger les exercices."
          onRetry={retry}
        />
      </section>
    );
  }

  return (
    <section className="min-h-full bg-[#0F172A] px-4 pb-8 pt-5 text-[#F8FAFC]">
      <header className="mb-5">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-[#06B6D4]">
          Catalogue
        </p>

        <h1 className="font-display text-3xl font-extrabold italic uppercase tracking-wide">
          Exercices
        </h1>
      </header>

      <div className="mb-3">
        <SearchField
          value={search}
          onChange={setSearch}
          disabled={isCatalogEmpty}
        />
      </div>

      <div className="mb-5 flex flex-wrap items-start gap-2">
        <FilterPanel
          label="Zone musculaire"
          options={categories}
          selectedId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
          isOpen={openPanel === "category"}
          onToggle={() => togglePanel("category")}
          disabled={isCatalogEmpty}
        />

        <FilterPanel
          label="Matériel"
          options={equipment}
          selectedId={selectedEquipmentId}
          onSelect={setSelectedEquipmentId}
          isOpen={openPanel === "equipment"}
          onToggle={() => togglePanel("equipment")}
          disabled={isCatalogEmpty}
        />

        <FilterPanel
          label="Difficulté"
          options={difficulties}
          selectedId={selectedDifficultyId}
          onSelect={setSelectedDifficultyId}
          isOpen={openPanel === "difficulty"}
          onToggle={() => togglePanel("difficulty")}
          disabled={isCatalogEmpty}
        />

        {hasActiveFilter && (
          <button
            type="button"
            onClick={resetFilters}
            disabled={isCatalogEmpty}
            className="rounded-full border border-[#334155] bg-[#1E293B] px-4 py-2 text-xs font-semibold text-[#94A3B8] transition hover:border-[#FF6B35] hover:text-[#FF6B35] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {filtersError && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          Impossible de charger les filtres.
        </div>
      )}

      {isCatalogEmpty ? (
        <EmptyState />
      ) : (
        <>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              {exercises.length} résultat
              {exercises.length > 1 ? "s" : ""}
            </p>
          </div>

          {isLoading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: les skeletons sont statiques
                <ExerciseCardSkeleton key={index} />
              ))}
            </div>
          ) : exercises.length === 0 ? (
            <NoResultsState onReset={resetFilters} />
          ) : (
            <div className="flex flex-col gap-2">
              {exercises.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default Exercises;
```;
