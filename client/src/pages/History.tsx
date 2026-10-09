import { useState } from "react";
import LocalErrorState from "../components/feedback/LocalErrorState";
import Skeleton from "../components/feedback/Skeleton";
import HistoryEmptyState from "../components/history/HistoryEmptyState";
import HistoryFilters from "../components/history/HistoryFilters";
import HistoryNoResultsState from "../components/history/HistoryNoResultsState";
import HistoryTabs from "../components/history/HistoryTabs";
import SessionMonthGroup from "../components/history/SessionMonthGroup";
import useHistorySessions from "../hooks/workout-session/useHistorySessions";
import type { HistoryFilter } from "../types/filters";
import { getStartOfWeek } from "../utils/getStartOfWeek";
import { groupSessionsByMonth } from "../utils/groupSessionsByMonth";

const SKELETON_PLACEHOLDERS = [1, 2, 3];

function History() {
  const { sessions, loading, error, reload } = useHistorySessions();
  const [filter, setFilter] = useState<HistoryFilter>("all");

  const today = new Date();

  const sessionsMonth = sessions.filter((session) => {
    const sessionDate = new Date(session.date);
    return (
      sessionDate.getMonth() === today.getMonth() &&
      sessionDate.getFullYear() === today.getFullYear()
    );
  });

  const startOfWeek = getStartOfWeek(today);

  const sessionsWeek = sessions.filter((session) => {
    const sessionDate = new Date(session.date);
    return sessionDate >= startOfWeek;
  });

  let sessionsToShow = sessions;
  if (filter === "month") {
    sessionsToShow = sessionsMonth;
  }
  if (filter === "week") {
    sessionsToShow = sessionsWeek;
  }

  const monthGroups = groupSessionsByMonth(sessionsToShow);

  let content: React.ReactNode;

  if (loading) {
    content = (
      <ul className="mt-6 grid gap-3">
        {SKELETON_PLACEHOLDERS.map((placeholder) => (
          <li key={placeholder}>
            <Skeleton className="h-20 w-full" />
          </li>
        ))}
      </ul>
    );
  } else if (error !== null) {
    content = <LocalErrorState message={error} onRetry={reload} />;
  } else if (sessions.length === 0) {
    content = <HistoryEmptyState />;
  } else if (sessionsToShow.length === 0) {
    content = <HistoryNoResultsState onReset={() => setFilter("all")} />;
  } else {
    content = (
      <div className="mt-6 grid gap-6">
        {monthGroups.map((group) => (
          <SessionMonthGroup key={group.key} group={group} />
        ))}
      </div>
    );
  }

  return (
    <section>
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="font-display font-extrabold text-2xl uppercase italic">
          Historique
        </h1>
        <p className="font-semibold text-base-content/60 text-xs uppercase tracking-widest">
          {sessionsToShow.length}{" "}
          {sessionsToShow.length <= 1 ? "séance" : "séances"}
        </p>
      </div>

      <HistoryTabs />
      <HistoryFilters filter={filter} setFilter={setFilter} />

      {content}
    </section>
  );
}

export default History;
