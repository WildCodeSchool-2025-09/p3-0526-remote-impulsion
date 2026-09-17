import { useState } from "react";
import ArrowRightIcon from "../assets/icons/arrows/arrow-right.svg?react";
import EmptyState from "../components/EmptyState";
import ExerciseCard from "../components/ExerciseCard";
import ExerciseCardSkeleton from "../components/ExerciseCardSkeleton";
import ExerciseDetailSheet from "../components/ExerciseDetailSheet";
import FilterPanel from "../components/FilterPanel";
import NoResultsState from "../components/NoResultsState";
import SearchField from "../components/SearchField";
import LocalErrorState from "../components/feedback/LocalErrorState";
import useExercises from "../hooks/useExercises";
import useFilters from "../hooks/useFilters";

type OpenPanel = "category" | "equipment" | "difficulty" | null;

type ExercisesProps = {
  selectionMode?: boolean;
  excludedIds?: number[];
  isSubmitting?: boolean;
  onCancel?: () => void;
  onValidate?: (selectedIds: number[]) => void;
};

function Exercises({
  selectionMode,
  excludedIds = [],
  isSubmitting,
  onCancel,
  onValidate,
}: ExercisesProps) {
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
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(
    null,
  );
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  function handleToggleSelection(id: number) {
    if (excludedIds.includes(id)) {
      return;
    }

    setSelectedIds((previousSelectedIds) => {
      if (previousSelectedIds.includes(id)) {
        return previousSelectedIds.filter((selectedId) => selectedId !== id);
      }
      return [...previousSelectedIds, id];
    });
  }

  function togglePanel(panel: OpenPanel) {
    setOpenPanel((current) => (current === panel ? null : panel));
  }

  function handleOpenExerciseDetail(exerciseId: number) {
    setSelectedExerciseId(exerciseId);
  }

  function handleCloseExerciseDetail() {
    setSelectedExerciseId(null);
  }

  function handleClearSelection() {
    setSelectedIds([]);
  }

  function handleValidate() {
    onValidate?.(selectedIds);
  }

  if (error) {
    return (
      <section className="min-h-full bg-base-100 px-4 py-6">
        <LocalErrorState
          message="Impossible de charger les exercices."
          onRetry={retry}
        />
      </section>
    );
  }

  return (
    <section
      className={`min-h-full bg-base-100 px-4 pt-5 text-base-content ${
        selectionMode ? "pb-28" : "pb-8"
      }`}
    >
      <header className="mb-5 flex items-start gap-2">
        {selectionMode && (
          <button
            type="button"
            onClick={onCancel}
            aria-label="Retour à la séance"
            className="mt-2 grid size-9 shrink-0 place-items-center rounded-full transition-colors hover:bg-base-200 focus-visible:outline-2 focus-visible:outline-info focus-visible:outline-offset-2"
          >
            <ArrowRightIcon aria-hidden="true" className="size-5 rotate-180" />
          </button>
        )}

        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-accent">
            {selectionMode ? "Séance préparée" : "Catalogue"}
          </p>

          <h1 className="font-display text-3xl font-extrabold italic uppercase tracking-wide">
            {selectionMode ? "Choisir des exercices" : "Exercices"}
          </h1>
        </div>
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
            className="rounded-full border border-base-300 bg-base-200 px-4 py-2 font-semibold text-neutral text-xs transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {filtersError && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-error text-sm"
        >
          Impossible de charger les filtres.
        </div>
      )}

      {isCatalogEmpty ? (
        <EmptyState />
      ) : (
        <>
          <div className="mb-3 flex items-center justify-between">
            <p className="font-semibold text-neutral text-xs uppercase tracking-wider">
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
            <div
              className={
                selectionMode
                  ? "grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4"
                  : "flex flex-col gap-2"
              }
            >
              {exercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onSelect={handleOpenExerciseDetail}
                  selectionMode={selectionMode}
                  isSelected={selectedIds.includes(exercise.id)}
                  isUnavailable={excludedIds.includes(exercise.id)}
                  onToggleSelect={handleToggleSelection}
                />
              ))}
            </div>
          )}
        </>
      )}

      {selectionMode && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-base-300 border-t bg-base-200 px-4 py-3 lg:left-56">
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3">
            <span className="text-neutral text-sm">
              {selectedIds.length} exercice
              {selectedIds.length > 1 ? "s" : ""} sélectionné
              {selectedIds.length > 1 ? "s" : ""}
              {selectedIds.length > 0 && (
                <>
                  {" · "}
                  <button
                    type="button"
                    onClick={handleClearSelection}
                    disabled={isSubmitting}
                    className="font-semibold text-info disabled:opacity-50"
                  >
                    Vider
                  </button>
                </>
              )}
            </span>
            <button
              type="button"
              onClick={handleValidate}
              disabled={selectedIds.length === 0 || isSubmitting}
              className="rounded-lg bg-primary px-4 py-2 font-semibold text-primary-content text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Ajout..." : "Ajouter à ma séance"}
            </button>
          </div>
        </div>
      )}

      <ExerciseDetailSheet
        exerciseId={selectedExerciseId}
        onClose={handleCloseExerciseDetail}
        selectionMode={selectionMode}
        isSelected={
          selectedExerciseId !== null &&
          selectedIds.includes(selectedExerciseId)
        }
        isUnavailable={
          selectedExerciseId !== null &&
          excludedIds.includes(selectedExerciseId)
        }
        onToggleSelect={handleToggleSelection}
      />
    </section>
  );
}

export default Exercises;
