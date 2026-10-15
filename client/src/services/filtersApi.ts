import type { ReferenceItem } from "../types/filters";

async function fetchCategories(): Promise<ReferenceItem[]> {
  const url = `${import.meta.env.VITE_API_URL}/api/categories`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();

  return data;
}

async function fetchDifficulties(): Promise<ReferenceItem[]> {
  const url = `${import.meta.env.VITE_API_URL}/api/difficulties`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();

  return data;
}

async function fetchEquipment(): Promise<ReferenceItem[]> {
  const url = `${import.meta.env.VITE_API_URL}/api/equipment`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();

  return data;
}

export default { fetchCategories, fetchDifficulties, fetchEquipment };
