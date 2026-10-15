import type { ExerciseDetail, ExercisePage } from "../types/exercise";

async function fetchExercises(
  categoryId?: number,
  difficultyId?: number,
  equipmentId?: number,
  search?: string,
  page?: number,
  signal?: AbortSignal,
): Promise<ExercisePage> {
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

  if (page) {
    params.set("page", String(page));
  }

  const url = `${import.meta.env.VITE_API_URL}/api/exercises?${params.toString()}`;

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: ExercisePage = await response.json();

  return data;
}

async function fetchExerciseById(id: number): Promise<ExerciseDetail | null> {
  const url = `${import.meta.env.VITE_API_URL}/api/exercises/${id}`;
  const response = await fetch(url);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return data;
}

export default { fetchExercises, fetchExerciseById };
