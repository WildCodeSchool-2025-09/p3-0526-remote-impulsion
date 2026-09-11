import { useEffect, useState } from "react";
import filtersApi from "../services/filtersApi";
import type { ReferenceItem } from "../types/filters";

function useFilters() {
  const [categories, setCategories] = useState<ReferenceItem[]>([]);
  const [difficulties, setDifficulties] = useState<ReferenceItem[]>([]);
  const [equipment, setEquipment] = useState<ReferenceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadFilters() {
      try {
        setIsLoading(true);
        setError(null);
        const [categoriesData, difficultiesData, equipmentData] =
          await Promise.all([
            filtersApi.fetchCategories(),
            filtersApi.fetchDifficulties(),
            filtersApi.fetchEquipment(),
          ]);
        setCategories(categoriesData);
        setDifficulties(difficultiesData);
        setEquipment(equipmentData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    loadFilters();
  }, []);

  return { categories, difficulties, equipment, isLoading, error };
}

export default useFilters;
