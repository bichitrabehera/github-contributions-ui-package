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

interface Props {
  username: string;
  theme?: Theme;
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

// ─── YearPill ─────────────────────────────────────────────────────────────────

// ─── Main ─────────────────────────────────────────────────────────────────────
function GithubActivity({ username, theme = "dark", className }: Props) {
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
  const labels = useMemo(
    () => monthLabels(grid, selectedYear),
    [grid, selectedYear],
  );
  const outlineColor = theme === "light" ? "#333" : "#f0f0f0";

  return (
    <section
      className={["gcu w-full font-mono", className].filter(Boolean).join(" ")}
      style={{}}
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
