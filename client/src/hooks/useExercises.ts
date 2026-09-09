import { useCallback, useEffect, useRef, useState } from "react";
import exerciseApi from "../services/exerciseApi";
import type { ExerciseSummary } from "../types/exercise";

function useExercises() {
  const [exercises, setExercises] = useState<ExerciseSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [search, setSearch] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<number | null>(
    null,
  );
  const [selectedDifficultyId, setSelectedDifficultyId] = useState<
    number | null
  >(null);
  const [page, setPage] = useState(1);
  const [isCatalogEmpty, setIsCatalogEmpty] = useState(false);
  const isFirstLoad = useRef(true);

  const loadExercises = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await exerciseApi.fetchExercises(
          selectedCategoryId ?? undefined,
          selectedDifficultyId ?? undefined,
          selectedEquipmentId ?? undefined,
          search,
          signal,
        );
        setExercises(data);
        if (isFirstLoad.current) {
          isFirstLoad.current = false;
          setIsCatalogEmpty(data.length === 0);
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          return;
        }
        setError(err as Error);
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [search, selectedCategoryId, selectedEquipmentId, selectedDifficultyId],
  );

  useEffect(() => {
    setPage(1);
    const controller = new AbortController();
    loadExercises(controller.signal);
    return () => controller.abort();
  }, [loadExercises]);

  function resetFilters() {
    setSearch("");
    setSelectedCategoryId(null);
    setSelectedEquipmentId(null);
    setSelectedDifficultyId(null);
  }

  const hasActiveFilter =
    search !== "" ||
    selectedCategoryId !== null ||
    selectedEquipmentId !== null ||
    selectedDifficultyId !== null;

  return {
    exercises,
    isLoading,
    error,
    retry: () => loadExercises(),
    search,
    setSearch,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedEquipmentId,
    setSelectedEquipmentId,
    selectedDifficultyId,
    setSelectedDifficultyId,
    page,
    resetFilters,
    hasActiveFilter,
    isCatalogEmpty,
  };
}

export default useExercises;
