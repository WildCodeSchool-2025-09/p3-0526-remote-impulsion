import type { WorkoutSessionHistory } from "../types/workoutSession";

const LOCALE = "fr-FR";

export type SessionMonthGroup = {
  key: string;
  label: string;
  sessions: WorkoutSessionHistory[];
};

export const groupSessionsByMonth = (
  sessions: WorkoutSessionHistory[],
): SessionMonthGroup[] => {
  const groups: SessionMonthGroup[] = [];

  for (const session of sessions) {
    const sessionDate = new Date(session.date);
    const key = `${sessionDate.getFullYear()}-${sessionDate.getMonth()}`;
    const lastGroup = groups[groups.length - 1];

    if (lastGroup !== undefined && lastGroup.key === key) {
      lastGroup.sessions.push(session);
    } else {
      groups.push({
        key,
        label: sessionDate.toLocaleDateString(LOCALE, {
          month: "long",
          year: "numeric",
        }),
        sessions: [session],
      });
    }
  }

  return groups;
};
