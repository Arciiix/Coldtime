const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

export const formatDateToTimestamp = (date: Date): string => {
  return formatter.format(date).replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$1-$2"); // Changes "mm/dd/yyyy hh:mm:ss" to "yyyy-mm-dd hh:mm:ss"
};
