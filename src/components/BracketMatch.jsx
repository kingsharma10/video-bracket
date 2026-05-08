export default function BracketMatch({ match, isActive, onClick }) {
  if (!match) {
    return (
      <div className="w-36 h-16 mx-2 my-1 border border-dashed border-navy-border rounded-lg opacity-30" />
    );
  }

  const { video1, video2, votes1, votes2, winner } = match;
  const total = votes1 + votes2;
  const pct1 = total > 0 ? Math.round((votes1 / total) * 100) : null;
  const pct2 = total > 0 ? Math.round((votes2 / total) * 100) : null;

  const containerClass = [
    'w-36 mx-2 my-1 rounded-lg border text-[11px] transition-all duration-200',
    isActive
      ? 'border-knicks-orange animate-glow-orange bg-navy-750'
      : 'border-navy-border bg-navy-750',
    onClick ? 'cursor-pointer hover:border-knicks-blue' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClass} onClick={onClick} role={onClick ? 'button' : undefined}>
      <Competitor video={video1} pct={pct1} isWinner={winner === 1} isLoser={winner === 2} />
      <div className="text-center text-[9px] text-slate-600 py-0.5 border-t border-b border-navy-border font-bold">
        VS
      </div>
      <Competitor video={video2} pct={pct2} isWinner={winner === 2} isLoser={winner === 1} />
    </div>
  );
}

function Competitor({ video, pct, isWinner, isLoser }) {
  const cls = [
    'flex items-center gap-1 px-2 py-1.5 rounded-md transition-colors',
    isWinner ? 'text-knicks-orange font-bold' : '',
    isLoser  ? 'opacity-35 line-through text-slate-500' : 'text-slate-200',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls}>
      {isWinner && <span className="text-xs flex-shrink-0">🏆</span>}
      <span className="flex-1 truncate">{video?.title ?? 'TBD'}</span>
      {pct !== null && (
        <span className="flex-shrink-0 text-[10px] text-slate-500">{pct}%</span>
      )}
    </div>
  );
}
