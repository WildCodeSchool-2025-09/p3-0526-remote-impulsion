import type { WorkoutSession } from "../types/workoutSession";
import PreparedSessionCard from "./PreparedSessionCard";
import { Link } from "react-router";
import arrowRight from "../assets/icons/fleches/arrow-right.svg";

type PreparedSessionsListProps = {
  sessions: WorkoutSession[];
  limit?: number;
};

const PreparedSessionsList = ({
  sessions,
  limit,
}: PreparedSessionsListProps) => {
  const sessionsList = sessions.filter((s) => s.exerciseCount >= 1);
  const visibleSessions = limit ? sessionsList.slice(0, limit) : sessionsList;

  return (
    <div>
      <h2>SÉANCES PRÉPARÉES</h2>

      {sessionsList.length === 0 ? (
        <p>
          Aucune séance préparée. Prépare une séance à l'avance pour la
          retrouver ici, prête à démarrer.
        </p>
      ) : (
        <ul>
          {visibleSessions.map((session) => (
            <li key={session.id}>
              <PreparedSessionCard session={session} />
            </li>
          ))}
        </ul>
      )}
      {limit && sessionsList.length >= 4 && (
        <Link to="/sessions">
          Voir toutes <img src={arrowRight} alt="" />
        </Link>
      )}
    </div>
  );
};

export default PreparedSessionsList;
