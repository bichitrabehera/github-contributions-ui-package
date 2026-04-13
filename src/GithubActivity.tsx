"use client";
import { memo, useEffect, useState, useMemo } from "react";
import { STYLES } from "./components/Styles";
import { LIGHT, DARK, BLUE, PURPLE, GRAY } from "./components/Colors";
import { buildGrid } from "./components/BuildGrid";
import { Tooltip } from "./components/Tooltip";
import { YearPill } from "./components/YearPillProps";
import { monthLabels } from "./components/MonthLabels";
import { Skeleton } from "./components/Skeleton";
import { Day } from "./types/Day";

type Theme = "light" | "dark" | "blue" | "purple" | "gray";
type Background = "black" | "white";

interface Props {
  username: string;
  theme?: Theme;
  background?: Background;
  className?: string;
}

const DAY_LABELS: Record<number, string> = { 1: "Mon", 3: "Wed", 5: "Fri" };

const CELL = 13;
const GAP = 3;
const STEP = CELL + GAP;
const DAY_COL_W = 30;

const COLOR_MAP: Record<Theme, string[]> = {
  light: LIGHT,
  dark: DARK,
  blue: BLUE,
  purple: PURPLE,
  gray: GRAY,
};

function toLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function GithubActivity({ 
  username, 
  theme = "dark", 
  background = "black",
  className 
}: Props) {
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
  const isDark = background === "black";

  // Background and text colors based on mode
  const bgClass = isDark ? "bg-black" : "bg-white";
  const cardBgClass = isDark ? "bg-neutral-900" : "bg-neutral-50";
  const cardBorderClass = isDark 
    ? "border-neutral-800/60" 
    : "border-neutral-200/60";
  const textPrimaryClass = isDark ? "text-neutral-50" : "text-neutral-950";
  const textSecondaryClass = isDark ? "text-neutral-400" : "text-neutral-600";
  const textLabelClass = isDark ? "text-neutral-500" : "text-neutral-500";
  const outlineColor = isDark ? "#f0f0f0" : "#333";

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
  const labels = useMemo(
    () => monthLabels(grid, selectedYear),
    [grid, selectedYear],
  );

  return (
    <section
      className={["gcu w-full", bgClass, className].filter(Boolean).join(" ")}
      style={{ padding: "1.5rem" }}
    >
      {/* Header Section */}
      <div className="mb-6">
        <h2 className={`text-sm font-semibold ${textPrimaryClass} mb-3`}>
          Contributions
        </h2>

        {/* Stats */}
        <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
          <div className="flex flex-col">
            <span className={`text-xs ${textLabelClass} uppercase tracking-wide mb-1`}>
              Total
            </span>
            {loading ? (
              <div className={`w-20 h-6 ${isDark ? "bg-neutral-800" : "bg-neutral-200"} rounded animate-pulse`} />
            ) : error ? (
              <span className={`text-sm ${textSecondaryClass} italic`}>
                Unavailable
              </span>
            ) : (
              <span className={`text-2xl font-bold ${textPrimaryClass}`}>
                {total?.toLocaleString()}
              </span>
            )}
          </div>

          {bestDay && !loading && (
            <div className="flex flex-col">
              <span className={`text-xs ${textLabelClass} uppercase tracking-wide mb-1`}>
                Best Day
              </span>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: colors[4] }}
                />
                <span className={`text-sm ${textPrimaryClass} font-medium`}>
                  {bestDay.count} on {bestDay.date}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col">
            <span className={`text-xs ${textLabelClass} uppercase tracking-wide mb-1`}>
              Period
            </span>
            <span className={`text-sm ${textPrimaryClass} font-medium`}>
              {selectedYear === "last" ? "Last 12 months" : String(selectedYear)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className={`rounded-lg border ${cardBorderClass} ${cardBgClass} p-5 shadow-lg`}>
        {error ? (
          <div className="py-8 flex flex-col items-center justify-center">
            <p className={`text-sm ${textSecondaryClass}`}>
              Unable to fetch GitHub activity
            </p>
          </div>
        ) : loading ? (
          <Skeleton />
        ) : (
          <>
            {/* Contribution Grid */}
            <div className="overflow-x-auto -mx-5 -my-5 px-5 py-5">
              <div
                className="relative"
                style={{ minWidth: grid.length * STEP + DAY_COL_W + 8 }}
              >
                {/* Month labels */}
                <div
                  className="relative h-6 mb-3"
                  style={{ marginLeft: DAY_COL_W }}
                >
                  {labels.map(({ label, col }) => (
                    <span
                      key={label + col}
                      className={`absolute text-xs font-medium ${textLabelClass}`}
                      style={{ left: col * STEP }}
                    >
                      {label}
                    </span>
                  ))}
                </div>

                {/* Grid */}
                <div className="flex gap-1">
                  <div
                    className="flex flex-col gap-1"
                    style={{ width: DAY_COL_W - GAP }}
                  >
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-3 text-xs text-right pr-2 ${textLabelClass} font-medium`}
                      >
                        {DAY_LABELS[i] ?? ""}
                      </div>
                    ))}
                  </div>

                  {grid.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-1">
                      {week.map((day, di) => (
                        <div
                          key={di}
                          className="w-3 h-3 rounded transition-all duration-200 hover:scale-150 hover:shadow-lg cursor-pointer"
                          style={{
                            backgroundColor: day
                              ? colors[day.level]
                              : "transparent",
                            outline:
                              bestDay && day?.date === bestDay.date
                                ? `2px solid ${outlineColor}`
                                : "none",
                            outlineOffset: "2px",
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

            {/* Footer Section */}
            <div className={`space-y-4 border-t ${isDark ? "border-neutral-800/40" : "border-neutral-200/40"} pt-5 mt-5`}>
              

              {/* Year selector */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs font-medium ${textLabelClass} uppercase tracking-wide mr-1`}>
                  Year:
                </span>
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
            </div>
          </>
        )}
      </div>

      {tip && <Tooltip day={tip.day} x={tip.x} y={tip.y} />}
    </section>
  );
}

export default memo(GithubActivity);