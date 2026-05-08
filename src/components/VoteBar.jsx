export default function VoteBar({ votes1, votes2, label1, label2 }) {
  const total = votes1 + votes2;
  const pct1 = total > 0 ? Math.round((votes1 / total) * 100) : 50;
  const pct2 = total > 0 ? Math.round((votes2 / total) * 100) : 50;

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center text-xs mb-2 gap-2">
        <span className="text-slate-200 font-medium truncate">
          {label1} <strong className="text-knicks-blue font-bold">{votes1}</strong>
        </span>
        <span className="text-slate-500 flex-shrink-0">{total} votes</span>
        <span className="text-slate-200 font-medium truncate text-right">
          <strong className="text-knicks-orange font-bold">{votes2}</strong> {label2}
        </span>
      </div>

      <div className="flex h-3 rounded-full overflow-hidden bg-navy-700">
        <div
          className="bg-knicks-blue transition-all duration-500 ease-out"
          style={{ width: `${pct1}%` }}
        />
        <div
          className="bg-knicks-orange transition-all duration-500 ease-out"
          style={{ width: `${pct2}%` }}
        />
      </div>

      <div className="flex justify-between text-[11px] text-slate-500 mt-1">
        <span>{pct1}%</span>
        <span>{pct2}%</span>
      </div>
    </div>
  );
}
