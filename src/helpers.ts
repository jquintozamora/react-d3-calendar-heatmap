import { utcYear } from "d3-time";

export const pathMonth = (
  t: Date,
  weekday,
  cellSize,
  timeWeek,
  countDay
): string => {
  const n = weekday === "weekday" ? 5 : 7;
  const d = Math.max(0, Math.min(n, countDay(t.getUTCDay())));
  const w = timeWeek.count(utcYear(t), t);
  return `${
    d === 0
      ? `M${w * cellSize},0`
      : d === n
      ? `M${(w + 1) * cellSize},0`
      : `M${(w + 1) * cellSize},0V${d * cellSize}H${w * cellSize}`
  }V${n * cellSize}`;
};

export const sameDay = (first: Date, second: Date): boolean =>
  first.getUTCFullYear() === second.getUTCFullYear() &&
  first.getUTCMonth() === second.getUTCMonth() &&
  first.getUTCDate() === second.getUTCDate();

export const convertDateToUTCDate = (date: Date): Date => {
  const dateUTC = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );

  return new Date(dateUTC);
};
