import type { ExerciseDetail, ExerciseSummary } from "../types/exercise";

async function fetchExercises(): Promise<ExerciseSummary[]> {
  const url = `${import.meta.env.VITE_API_URL}/api/exercises`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();

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
