import ChevronRightIcon from "../../assets/icons/chevrons/chevron-right.svg?react";
import type { WorkoutSessionHistory } from "../../types/workoutSession";
import { formatDuration } from "../../utils/formatDuration";
import { formatSessionDateWithWeekday } from "../../utils/formatSessionDate";

type WorkoutSessionHistoryProps = {
  session: WorkoutSessionHistory;
};

const SessionHistoryCard = ({ session }: WorkoutSessionHistoryProps) => {
  const formattedDate = formatSessionDateWithWeekday(session.date);

  return (
    <article className="grid grid-cols-[1fr_auto] items-center gap-x-4 rounded-box border border-base-300 bg-base-200 p-4">
      <h3 className="font-semibold text-base-content first-letter:uppercase">
        {formattedDate}
      </h3>
      <p className="col-start-1 mt-0.5 text-base-content/75 text-sm">
        {formatDuration(session.durationSeconds)} · {session.exerciseCount}{" "}
        {session.exerciseCount <= 1 ? "exercice" : "exercices"} ·{" "}
        {session.totalVolumeKg.toLocaleString("fr-FR")} kg
      </p>
      <ChevronRightIcon
        aria-hidden="true"
        className="col-start-2 row-span-2 row-start-1 size-5 text-base-content/50"
      />
    </article>
  );
};

export default SessionHistoryCard;
