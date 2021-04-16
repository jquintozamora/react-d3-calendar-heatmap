import { utcYear } from "d3-time";

export const pathMonth = (t: Date, weekday, cellSize, timeWeek, countDay) => {
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
