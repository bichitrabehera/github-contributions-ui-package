import { Day } from "../types/Day";

export function Tooltip({ day, x, y }: { day: Day; x: number; y: number }) {
  const label = new Date(day.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <div
      className="gcu fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full px-2.5 py-1.5 rounded-md text-xs font-mono whitespace-nowrap shadow-xl bg-neutral-900 text-white"
      style={{ left: x, top: y - 8 }}
    >
      <b>
        {day.count} contribution{day.count !== 1 ? "s" : ""}
      </b>{" "}
      · {label}
    </div>
  );
}