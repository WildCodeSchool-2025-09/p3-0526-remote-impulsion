import { useEffect, useState } from "react";

function Exercises() {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const url = `${import.meta.env.VITE_API_URL}/api/exercises`;
      console.log(url);
      const response = await fetch(url);
      const data = await response.json();
      setExercises(data);
    }

    fetchData();
  }, []);

  console.log(exercises);

  return (
    <h1 className="text-2xl font-display italic font-extrabold uppercase">
      Exercices
    </h1>
  );
}

export default Exercises;
