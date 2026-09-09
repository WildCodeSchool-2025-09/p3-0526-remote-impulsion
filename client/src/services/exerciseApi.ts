async function fetchExercises(
  categoryId?: number,
  difficultyId?: number,
  equipmentId?: number,
  search?: string,
  signal?: AbortSignal,
) {
  const params = new URLSearchParams();

  if (categoryId) {
    params.set("categoryId", String(categoryId));
  }
  if (difficultyId) {
    params.set("difficultyId", String(difficultyId));
  }
  if (equipmentId) {
    params.set("equipmentId", String(equipmentId));
  }
  if (search) {
    params.set("search", search);
  }

  const url = `${import.meta.env.VITE_API_URL}/api/exercises?${params.toString()}`;
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();

  return data;
}

export default { fetchExercises };
