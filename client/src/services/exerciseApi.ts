async function fetchExercises() {
  const url = `${import.meta.env.VITE_API_URL}/api/exercises`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();

  return data;
}

export default { fetchExercises };
