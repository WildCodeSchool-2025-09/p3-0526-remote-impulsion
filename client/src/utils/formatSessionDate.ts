const LOCALE = "fr-FR";

export const formatSessionDateShort = (createdAt: string): string =>
  new Date(createdAt)
    .toLocaleDateString(LOCALE, {
      day: "numeric",
      month: "short",
    })
    .replace(".", "");

export const formatSessionDateLong = (createdAt: string): string =>
  new Date(createdAt).toLocaleDateString(LOCALE, {
    day: "numeric",
    month: "long",
  });

export const formatSessionStartTime = (startedAt: string): string =>
  new Date(startedAt).toLocaleTimeString(LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
  });
