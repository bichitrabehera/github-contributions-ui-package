import { Day } from "../types/Day";

export function buildGrid(
  dayMap: Map<string, Day>,
  year: number | "last",
): (Day | null)[][] {
  // Determine the logical range
  let rangeStart: Date;
  let end: Date;

  if (year === "last") {
    end = new Date();
    rangeStart = new Date(end);
    rangeStart.setFullYear(rangeStart.getFullYear() - 1);
    rangeStart.setDate(rangeStart.getDate() + 1);
  } else {
    rangeStart = new Date(year, 0, 1);
    end =
      year === new Date().getFullYear() ? new Date() : new Date(year, 11, 31);
  }

  // Rewind to the Sunday of the week containing rangeStart.
  // Days in that partial first week that fall before rangeStart render as null.
  const gridStart = new Date(rangeStart);
  gridStart.setDate(gridStart.getDate() - gridStart.getDay());

  const weeks: (Day | null)[][] = [];
  const cur = new Date(gridStart);

  while (cur <= end) {
    const week: (Day | null)[] = [];
    for (let d = 0; d < 7; d++) {
      if (cur < rangeStart || cur > end) {
        week.push(null);
      } else {
        const iso = cur.toISOString().slice(0, 10);
        week.push(dayMap.get(iso) ?? { date: iso, count: 0, level: 0 });
      }
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }

  return weeks;
}
