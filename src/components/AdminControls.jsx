export default function AdminControls({
  state,
  currentMatch,
  onOpenVoting,
  onCloseVoting,
  onDeclareWinner,
  onInitialize,
  onReset,
}) {
  const { votingOpen, champion } = state ?? {};
  const { video1, video2, winner } = currentMatch ?? {};
  const tournamentOver = !!champion;

  return (
    <div className="p-4 flex flex-col gap-3 flex-1">
      <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
        Admin Controls
      </h3>

      {tournamentOver ? (
        <div className="text-center py-3">
          <div className="text-4xl">🏆</div>
          <p className="text-knicks-orange font-bold text-sm mt-2">{champion?.title}</p>
          <p className="text-[11px] text-slate-500 mt-1">Tournament Champion!</p>
        </div>
      ) : !currentMatch ? (
        <div className="flex flex-col gap-2">
          <p className="text-[11px] text-slate-500 leading-relaxed">No tournament running.</p>
          <Button variant="blue" onClick={onInitialize}>
            Start Tournament
          </Button>
        </div>
      ) : (
        <>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {winner
              ? 'Winner declared. Ready for next match.'
              : votingOpen
              ? 'Voting is open. Close when ready to tally.'
              : 'Open voting so audience can vote.'}
          </p>

          {!winner && (
            votingOpen ? (
              <Button variant="orange" onClick={onCloseVoting}>
                Close Voting
              </Button>
            ) : (
              <Button variant="blue" onClick={onOpenVoting}>
                Open Voting
              </Button>
            )
          )}

          {!votingOpen && !winner && video1 && video2 && (
            <div className="flex flex-col gap-1.5 mt-1">
              <p className="text-[10px] text-slate-600 uppercase tracking-wider">Declare winner:</p>
              <Button variant="winner" onClick={() => onDeclareWinner(1)}>
                {video1.title}
              </Button>
              <Button variant="winner" onClick={() => onDeclareWinner(2)}>
                {video2.title}
              </Button>
            </div>
          )}
        </>
      )}

      <div className="mt-auto pt-3 border-t border-navy-border">
        <Button variant="danger" onClick={onReset}>
          Reset Tournament
        </Button>
      </div>
    </div>
  );
}

function Button({ variant, onClick, children }) {
  const base = 'w-full py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-150 active:scale-95 disabled:opacity-50 text-center';
  const variants = {
    blue:   'bg-knicks-blue hover:bg-knicks-blue-d text-white',
    orange: 'bg-knicks-orange hover:bg-knicks-orange-d text-black',
    winner: 'bg-navy-600 hover:bg-navy-500 text-slate-200 border border-navy-border truncate',
    danger: 'bg-red-700 hover:bg-red-600 text-white',
  };
  return (
    <button className={`${base} ${variants[variant]}`} onClick={onClick}>
      {children}
    </button>
  );
}
