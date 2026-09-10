import type { WorkoutSession } from "../types/workoutSession";

type PreparedSessionCardProps = {
  session: WorkoutSession;
};

const PreparedSessionCard = ({ session }: PreparedSessionCardProps) => {
  const formattedDate = new Date(session.createdAt).toLocaleDateString(
    "fr-FR",
    {
      day: "numeric",
      month: "short",
    },
  );

  return (
    <>
      <div>
        <p>Séance du {formattedDate}</p>
        <p>
          {session.exerciseCount}{" "}
          {session.exerciseCount === 1 ? "exercice" : "exercices"}
        </p>
        <button type="button">Voir la séance</button>
      </div>
    </>
  );
};

export default PreparedSessionCard;
