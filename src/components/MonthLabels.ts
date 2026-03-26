import { Day } from "../types/Day";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function monthLabels(grid: (Day | null)[][], year: number | "last") {
  const out: { label: string; col: number }[] = [];
  let lastMonth = -1;
  grid.forEach((week, i) => {
    const first = week.find(Boolean);
    if (!first) return;
    const m = new Date(first.date).getMonth();
    if (m !== lastMonth) {
      // If the very first column is a partial week whose first real day
      // isn't Sunday (index > 0), the month label belongs to a prior-month
      // sliver and would collide with the next label. Suppress it.
      const isOrphanedSliver =
        i === 0 &&
        week.findIndex(Boolean) > 0 &&
        (year !== "last" ? m !== 0 : true);
      if (!isOrphanedSliver) {
        out.push({ label: MONTHS[m], col: i });
      }
      lastMonth = m;
    }
  });
  return out;
}
