import { useState } from "react";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import ExerciseCard from "../components/ExerciseCard";
import ExerciseCardSkeleton from "../components/ExerciseCardSkeleton";
import FilterPanel from "../components/FilterPanel";
import NoResultsState from "../components/NoResultsState";
import SearchField from "../components/SearchField";
import useExercises from "../hooks/useExercises";
import useFilters from "../hooks/useFilters";

type OpenPanel = "category" | "equipment" | "difficulty" | null;

function ExercisesPage() {
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
  const { categories, difficulties, equipment } = useFilters();
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);

  function togglePanel(panel: OpenPanel) {
    setOpenPanel((current) => (current === panel ? null : panel));
  }

  if (error) {
    return <ErrorState retry={retry} />;
  }

  return (
    <section>
      <h1 className="text-2xl font-display italic font-extrabold uppercase">
        Exercices
      </h1>

      <div className="flex flex-wrap items-start gap-3 py-4">
        <SearchField
          value={search}
          onChange={setSearch}
          disabled={isCatalogEmpty}
        />
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
        <button
          type="button"
          onClick={resetFilters}
          disabled={isCatalogEmpty || !hasActiveFilter}
          className="btn btn-ghost btn-sm"
        >
          Réinitialiser
        </button>
      </div>

      {isCatalogEmpty ? (
        <EmptyState />
      ) : (
        <>
          <p className="text-sm text-base-content/70">
            {exercises.length} résultat{exercises.length > 1 ? "s" : ""}
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 6 }).map((_, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeletons identiques et statiques, pas de réordonnancement possible
                <ExerciseCardSkeleton key={index} />
              ))}
            </div>
          ) : exercises.length === 0 ? (
            <NoResultsState onReset={resetFilters} />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

export default ExercisesPage;
