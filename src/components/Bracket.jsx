import BracketMatch from './BracketMatch';

const ROUNDS = [
  { label: 'Round of 16', matchIds: ['r1m1','r1m2','r1m3','r1m4','r1m5','r1m6','r1m7','r1m8'] },
  { label: 'Quarters',    matchIds: ['r2m1','r2m2','r2m3','r2m4'] },
  { label: 'Semis',       matchIds: ['r3m1','r3m2'] },
  { label: 'Final',       matchIds: ['r4m1'] },
];

export default function Bracket({ matches, currentMatchId }) {
  return (
    <div className="flex items-stretch min-w-max">
      {ROUNDS.map((round) => (
        <BracketRound
          key={round.label}
          label={round.label}
          matchIds={round.matchIds}
          matches={matches}
          currentMatchId={currentMatchId}
        />
      ))}
    </div>
  );
}

function BracketRound({ label, matchIds, matches, currentMatchId }) {
  // Group into pairs for connector lines (Final has just 1 match, no pairing needed)
  const pairs = [];
  for (let i = 0; i < matchIds.length; i += 2) {
    pairs.push(matchIds.slice(i, i + 2));
  }
  const isFinal = matchIds.length === 1;

  return (
    <div className="flex flex-col border-r border-navy-border last:border-r-0">
      {/* Round label header */}
      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center py-1.5 px-2 bg-navy-800 border-b border-navy-border whitespace-nowrap">
        {label}
      </div>

      {/* Matches */}
      <div className={`flex flex-col flex-1 ${isFinal ? 'justify-center' : 'justify-around'}`}>
        {isFinal ? (
          /* Final match — centered, no connector slots */
          <div className="relative bracket-slot-incoming px-2">
            <BracketMatch
              match={matches[matchIds[0]]}
              isActive={matchIds[0] === currentMatchId}
            />
          </div>
        ) : (
          pairs.map((pair) => (
            <div key={pair[0]} className="relative bracket-pair-wrap flex flex-col flex-1 justify-around">
              {pair.map((id) => (
                <div key={id} className="relative bracket-slot flex items-center flex-1">
                  <BracketMatch
                    match={matches[id]}
                    isActive={id === currentMatchId}
                  />
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
