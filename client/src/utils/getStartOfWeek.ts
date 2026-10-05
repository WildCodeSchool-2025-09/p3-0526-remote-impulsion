export const getStartOfWeek = (today: Date): Date => {
  const dayNumber = today.getDay();
  const daysSinceMonday = dayNumber === 0 ? 6 : dayNumber - 1;

  return new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - daysSinceMonday,
  );
};
