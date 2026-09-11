import { Link } from "react-router";
import ArrowRightIcon from "../assets/icons/fleches/arrow-right.svg?react";
import CalendarIcon from "../assets/icons/navigation/calendar-month.svg?react";
import type { WorkoutSession } from "../types/workoutSession";
import PreparedSessionCard from "./PreparedSessionCard";

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
    <div className="mt-6 grid grid-cols-[1fr_auto] items-center gap-x-4">
      <h2 className="font-semibold text-accent text-xs uppercase tracking-widest">
        SÉANCES PRÉPARÉES
      </h2>

      {sessionsList.length === 0 ? (
        <div
          className={`col-span-2 rounded-box border border-base-300 border-dashed text-base-content/75 text-sm leading-6 ${
            limit
              ? "mt-3 p-4"
              : "mt-8 flex flex-col items-center gap-4 bg-linear-to-b from-primary/10 to-transparent px-6 py-10 text-center"
          }`}
        >
          {!limit && (
            <span
              aria-hidden="true"
              className="grid size-14 place-items-center rounded-full bg-primary/15 text-primary"
            >
              <CalendarIcon className="size-7" />
            </span>
          )}
          <p className="max-w-md">
            <span
              className={
                limit
                  ? ""
                  : "mb-1 block font-display font-extrabold text-base-content text-xl uppercase italic"
              }
            >
              Aucune séance préparée.
            </span>{" "}
            Prépare une séance à l'avance pour la retrouver ici, prête à
            démarrer.
          </p>
        </div>
      ) : (
        <ul
          className={`col-span-2 mt-3 grid gap-3 ${
            limit ? "" : "md:grid-cols-2 xl:grid-cols-3"
          }`}
        >
          {visibleSessions.map((session) => (
            <li key={session.id}>
              <PreparedSessionCard session={session} />
            </li>
          ))}
        </ul>
      )}
      {limit && sessionsList.length >= 4 && (
        <Link
          to="/sessions"
          className="group col-start-2 row-start-1 flex items-center gap-1.5 rounded-field font-semibold text-info text-sm transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-info focus-visible:outline-offset-2"
        >
          Voir toutes{" "}
          <ArrowRightIcon
            aria-hidden="true"
            className="size-4 transition-transform group-hover:translate-x-1"
          />
        </Link>
      )}
    </div>
  );
};

export default PreparedSessionsList;
