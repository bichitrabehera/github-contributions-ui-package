export function Skeleton() {
  return (
    <div className="flex gap-[3px] mx-auto animate-pulse opacity-40">
      {Array.from({ length: 40 }).map((_, w) => (
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
