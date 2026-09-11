import { Link } from "react-router";
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
        <Link to={`/sessions/${session.id}`}>Voir la séance</Link>
      </div>
    </>
  );
};

export default PreparedSessionCard;
