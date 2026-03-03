"use client";

import { memo, useEffect, useState, useMemo } from "react";

type Theme = "light" | "dark" | "blue" | "purple";

interface Day {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface Props {
  username: string;
  theme?: Theme;
  className?: string;
}

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
const DAY_LABELS: Record<number, string> = { 1: "Mon", 3: "Wed", 5: "Fri" };

const CELL = 13;
const GAP = 3;
const STEP = CELL + GAP;
const DAY_COL_W = 30;

const LIGHT = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
const DARK = ["#21262d", "#0e4429", "#006d32", "#26a641", "#39d353"];
const BLUE = ["#21262d", "#a3c9ff", "#5fa3ff", "#2f7bff", "#0b5cff"];
const PURPLE = ["#21262d", "#d8b4ff", "#c084fc", "#a855f7", "#7e22ce"];

const COLOR_MAP: Record<Theme, string[]> = {
  light: LIGHT,
  dark: DARK,
  blue: BLUE,
  purple: PURPLE,
};

function toLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
}

function buildGrid(
  dayMap: Map<string, Day>,
  year: number | "last",
): (Day | null)[][] {
  let start: Date;
  let end: Date;

  if (year === "last") {
    end = new Date();
    start = new Date(end);
    start.setFullYear(start.getFullYear() - 1);
    start.setDate(start.getDate() + 1);
  } else {
    start = new Date(year, 0, 1);
    end =
      year === new Date().getFullYear() ? new Date() : new Date(year, 11, 31);
  }

  start.setDate(start.getDate() - start.getDay());

  const weeks: (Day | null)[][] = [];
  const cur = new Date(start);

  while (cur <= end) {
    const week: (Day | null)[] = [];
    for (let d = 0; d < 7; d++) {
      const iso = cur.toISOString().slice(0, 10);
      if (cur > end) week.push(null);
      else week.push(dayMap.get(iso) ?? { date: iso, count: 0, level: 0 });
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

function monthLabels(grid: (Day | null)[][]) {
  const out: { label: string; col: number }[] = [];
  let last = -1;
  grid.forEach((week, i) => {
    const first = week.find(Boolean);
    if (!first) return;
    const m = new Date(first.date).getMonth();
    if (m !== last) {
      out.push({ label: MONTHS[m], col: i });
      last = m;
    }
  });
  return out;
}

function Tooltip({ day, x, y }: { day: Day; x: number; y: number }) {
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

function Skeleton() {
  return (
    <div className="flex gap-[3px] animate-pulse opacity-40">
      {Array.from({ length: 45 }).map((_, w) => (
        <div key={w} className="flex flex-col gap-[3px]">
          {Array.from({ length: 7 }).map((_, d) => (
            <div
              key={d}
              className="w-[13px] h-[13px] rounded-[3px] bg-neutral-700"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── YearPill — fully inline styles, zero Tailwind dependency ─────────────────
type YearPillProps = { label: string; active: boolean; onClick: () => void };

export function YearPill({ label, active, onClick }: YearPillProps) {
  const [hovered, setHovered] = useState(false);

  const baseStyle: React.CSSProperties = {
    padding: "2px 10px",
    fontSize: 12,
    fontWeight: 500,
    borderRadius: 9999,
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.15s ease, color 0.15s ease",
    userSelect: "none",
    outline: "none",
    // Active = white pill with dark text
    // Inactive = dark pill with muted text, slightly lighter on hover
    backgroundColor: active ? "#ffffff" : hovered ? "#3f3f46" : "#262626",
    color: active ? "#000000" : "#ffffff",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      style={baseStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </button>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function GithubActivity({ username, theme = "dark", className }: Props) {
  const STYLES = `
  .gcu .relative{position:relative}
  .gcu .absolute{position:absolute}
  .gcu .fixed{position:fixed}
  .gcu .z-50{z-index:50}
  .gcu .pointer-events-none{pointer-events:none}
  .gcu .flex{display:flex}
  .gcu .flex-col{flex-direction:column}
  .gcu .flex-wrap{flex-wrap:wrap}
  .gcu .items-center{align-items:center}
  .gcu .justify-start{justify-content:flex-start}
  .gcu .inline-block{display:inline-block}
  .gcu .w-full{width:100%}
  .gcu .w-\\[10px\\]{width:10px}
  .gcu .w-\\[13px\\]{width:13px}
  .gcu .h-\\[10px\\]{height:10px}
  .gcu .h-\\[13px\\]{height:13px}
  .gcu .h-\\[18px\\]{height:18px}
  .gcu .-translate-x-1\\/2{transform:translateX(-50%)}
  .gcu .-translate-y-full{transform:translateY(-100%)}
  .gcu .gap-\\[3px\\]{gap:3px}
  .gcu .gap-1{gap:0.25rem}
  .gcu .gap-1\\.5{gap:0.375rem}
  .gcu .gap-x-6{column-gap:1.5rem}
  .gcu .gap-y-1{row-gap:0.25rem}
  .gcu .mb-4{margin-bottom:1rem}
  .gcu .mt-3{margin-top:0.75rem}
  .gcu .mt-4{margin-top:1rem}
  .gcu .mr-1{margin-right:0.25rem}
  .gcu .ml-1{margin-left:0.25rem}
  .gcu .p-4{padding:1rem}
  .gcu .pt-3{padding-top:0.75rem}
  .gcu .pt-px{padding-top:1px}
  .gcu .pb-1{padding-bottom:0.25rem}
  .gcu .pr-1\\.5{padding-right:0.375rem}
  .gcu .px-2\\.5{padding-left:0.625rem;padding-right:0.625rem}
  .gcu .py-1\\.5{padding-top:0.375rem;padding-bottom:0.375rem}
  .gcu .rounded-\\[2px\\]{border-radius:2px}
  .gcu .rounded-\\[3px\\]{border-radius:3px}
  .gcu .rounded-md{border-radius:0.375rem}
  .gcu .rounded-xl{border-radius:0.75rem}
  .gcu .text-right{text-align:right}
  .gcu .text-\\[10px\\]{font-size:10px}
  .gcu .text-\\[11px\\]{font-size:11px}
  .gcu .text-xs{font-size:0.75rem}
  .gcu .text-sm{font-size:0.875rem}
  .gcu .font-mono{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace}
  .gcu .font-medium{font-weight:500}
  .gcu .font-semibold{font-weight:600}
  .gcu .select-none{-webkit-user-select:none;-ms-user-select:none;user-select:none}
  .gcu .whitespace-nowrap{white-space:nowrap}
  .gcu .overflow-x-auto{overflow-x:auto}
  .gcu .border{border-width:1px;border-style:solid;border-color:#262626}
  .gcu .border-neutral-800{border-color:#262626}
  .gcu .border-t{border-top-width:1px;border-top-style:solid;border-top-color:#262626}
  .gcu .transition-transform{transition-property:transform;transition-duration:0.1s;transition-timing-function:ease}
  @keyframes gcu-pulse{50%{opacity:.5}}
  .gcu .animate-pulse{animation:gcu-pulse 2s cubic-bezier(0.4,0,0.6,1) infinite}
  .gcu .hover\\:scale-125:hover{transform:scale(1.25)}
  .gcu .text-neutral-400{color:#9ca3af}
  .gcu .text-neutral-200{color:#e5e7eb}
  .gcu .bg-neutral-700{background-color:#3f3f46}
  .gcu .bg-neutral-900{background-color:#171717}
  .gcu .bg-neutral-950{background-color:#0a0a0a}
  .gcu .text-white{color:#fff}
  .gcu .shadow-xl{box-shadow:0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04)}
  `;

  useEffect(() => {
    if (typeof document === "undefined") return;
    const id = "github-contributions-ui-inline";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = STYLES;
    document.head.appendChild(style);
  }, []);

  const [allDays, setAllDays] = useState<Map<string, Day>>(new Map());
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | "last">("last");
  const [total, setTotal] = useState<number | null>(null);
  const [bestDay, setBestDay] = useState<Day | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tip, setTip] = useState<{ day: Day; x: number; y: number } | null>(
    null,
  );

  const colors = COLOR_MAP[theme] ?? COLOR_MAP.dark;

  useEffect(() => {
    if (!username) return;
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${username}?y=all`,
        );
        if (!res.ok) throw new Error();
        const json = await res.json();

        const map = new Map<string, Day>();
        const yearSet = new Set<number>();

        json.contributions.forEach((c: { date: string; count: number }) => {
          map.set(c.date, {
            date: c.date,
            count: c.count,
            level: toLevel(c.count),
          });
          yearSet.add(new Date(c.date).getFullYear());
        });

        if (!mounted) return;
        setAllDays(map);
        setYears(Array.from(yearSet).sort((a, b) => b - a));
        setError(false);
      } catch {
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [username]);

  useEffect(() => {
    if (!allDays.size) return;

    const entries = Array.from(allDays.values()).filter((d) => {
      if (selectedYear === "last") {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        return new Date(d.date) >= oneYearAgo;
      }
      return new Date(d.date).getFullYear() === selectedYear;
    });

    setTotal(entries.reduce((s, d) => s + d.count, 0));
    const best = entries.reduce<Day | null>(
      (b, d) => (!b || d.count > b.count ? d : b),
      null,
    );
    setBestDay(best && best.count > 0 ? best : null);
  }, [allDays, selectedYear]);

  const grid = useMemo(
    () => (allDays.size ? buildGrid(allDays, selectedYear) : []),
    [allDays, selectedYear],
  );
  const labels = useMemo(() => monthLabels(grid), [grid]);
  const outlineColor = theme === "light" ? "#333" : "#f0f0f0";

  return (
    <section
      className={["gcu w-full font-mono", className].filter(Boolean).join(" ")}
    >
      {/* Stats */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mb-4 text-xs text-neutral-400">
        {loading
          ? "Loading…"
          : error
            ? "Unavailable"
            : `${total?.toLocaleString()} contributions ${selectedYear === "last" ? "in the last year" : `in ${selectedYear}`}`}

        {bestDay && !loading && (
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block w-[10px] h-[10px] rounded-[2px]"
              style={{ backgroundColor: colors[4] }}
            />
            Best day:
            <span className="text-neutral-200 font-semibold">
              {bestDay.count} contributions on {bestDay.date}
            </span>
          </span>
        )}
      </div>

      {/* Card */}
      <div className="border border-neutral-800 rounded-xl p-4 bg-neutral-950">
        {error ? (
          <p className="text-sm text-neutral-400 italic">
            GitHub activity unavailable.
          </p>
        ) : loading ? (
          <Skeleton />
        ) : (
          <>
            <div className="overflow-x-auto pb-1">
              <div
                className="relative"
                style={{ minWidth: grid.length * STEP + DAY_COL_W + 8 }}
              >
                {/* Month labels */}
                <div
                  className="relative h-[18px] mb-1"
                  style={{ marginLeft: DAY_COL_W }}
                >
                  {labels.map(({ label, col }) => (
                    <span
                      key={label + col}
                      className="absolute text-[11px] text-neutral-400"
                      style={{ left: col * STEP }}
                    >
                      {label}
                    </span>
                  ))}
                </div>

                {/* Grid */}
                <div className="flex gap-[3px]">
                  <div
                    className="flex flex-col gap-[3px]"
                    style={{ width: DAY_COL_W - GAP }}
                  >
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-[13px] text-[10px] text-right pr-1.5 text-neutral-400"
                      >
                        {DAY_LABELS[i] ?? ""}
                      </div>
                    ))}
                  </div>

                  {grid.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[3px]">
                      {week.map((day, di) => (
                        <div
                          key={di}
                          className="w-[13px] h-[13px] rounded-[3px] transition-transform hover:scale-125"
                          style={{
                            backgroundColor: day
                              ? colors[day.level]
                              : "transparent",
                            outline:
                              bestDay && day?.date === bestDay.date
                                ? `2px solid ${outlineColor}`
                                : "none",
                            outlineOffset: "1px",
                          }}
                          onMouseEnter={(e) => {
                            if (!day) return;
                            const r = e.currentTarget.getBoundingClientRect();
                            setTip({ day, x: r.left + r.width / 2, y: r.top });
                          }}
                          onMouseLeave={() => setTip(null)}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-1 mt-3 text-[11px] text-neutral-400">
              Less
              {colors.map((c, i) => (
                <div
                  key={i}
                  className="w-[13px] h-[13px] rounded-[3px]"
                  style={{ backgroundColor: c }}
                />
              ))}
              More
            </div>

            {/* Year selector */}
            <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-neutral-800">
              <span className="text-[11px] text-neutral-400 mr-1">Year:</span>
              <YearPill
                label="Last year"
                active={selectedYear === "last"}
                onClick={() => setSelectedYear("last")}
              />
              {years.map((y) => (
                <YearPill
                  key={y}
                  label={String(y)}
                  active={selectedYear === y}
                  onClick={() => setSelectedYear(y)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {tip && <Tooltip day={tip.day} x={tip.x} y={tip.y} />}
    </section>
  );
}

export default memo(GithubActivity);
