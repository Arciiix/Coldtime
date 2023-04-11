import i18next from "i18next";

const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const units: Partial<Record<Intl.RelativeTimeFormatUnit, number>> = {
  year: 31_557_600_000, // 86,400 seconds per day * 365.25 days.
  month: 2_629_800_000, // 31,557,600 seconds per year / 12 months.
  day: 86_400_000,
  hour: 3_600_000,
  minute: 60_000,
  second: 1_000,
};

export const formatDate = (date: Date) => {
  return formatter
    .format(date)
    .replace(/^(\d{2})\/(\d{2})\/(\d{4}).*$/, "$3-$1-$2"); // Changes "mm/dd/yyyy hh:mm:ss" to "yyyy-mm-dd"
};

export const formatDateToTimestamp = (date: Date): string => {
  return formatter.format(date).replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$1-$2"); // Changes "mm/dd/yyyy hh:mm:ss" to "yyyy-mm-dd hh:mm:ss"
};

export const formatDateAgo = (date: Date): string => {
  // It should be negative if it was in the past
  const differenceInMs = date.getTime() - new Date().getTime();
  return formatTimeAgo(differenceInMs);
};

export const formatTimeAgo = (timeInMs: number): string => {
  const rtf = new Intl.RelativeTimeFormat(i18next.language, {
    numeric: "auto",
  });

  for (const [unit, value] of Object.entries(units)) {
    const amount = Math.ceil(timeInMs / value);
    if (amount || unit === "second") {
      return rtf.format(amount, unit as Intl.RelativeTimeFormatUnit);
    }
  }

  return rtf.format(Math.floor(timeInMs / 1000), "second");
};
