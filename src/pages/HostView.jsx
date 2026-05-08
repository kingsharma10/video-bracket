import { useTournament } from '../hooks/useTournament';
import Bracket from '../components/Bracket';
import VideoPlayer from '../components/VideoPlayer';
import VoteBar from '../components/VoteBar';
import QRCodePanel from '../components/QRCodePanel';
import AdminControls from '../components/AdminControls';

const VOTE_URL = `${window.location.origin}/vote`;
const ROUND_LABELS = ['Round of 16', 'Quarterfinals', 'Semifinals', 'Final'];

export default function HostView() {
  const {
    loading,
    error,
    matches,
    state,
    currentMatch,
    openVoting,
    closeVoting,
    declareWinner,
    initialize,
    reset,
  } = useTournament();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-navy-900 text-slate-400">
        <div className="w-10 h-10 rounded-full border-2 border-navy-border border-t-knicks-blue animate-spin mb-4" />
        <p className="text-sm">Connecting to tournament…</p>
      </div>
    );
  }

  const roundLabel = currentMatch ? (ROUND_LABELS[currentMatch.round] ?? 'Match') : null;

  const handleReset = () => {
    if (window.confirm('Reset the entire tournament? All votes will be cleared.')) {
      reset();
    }
  };

  return (
    <div className="flex min-h-screen bg-navy-900 text-slate-100">

      {/* ── Sidebar ── */}
      <aside className="w-52 min-w-[208px] bg-navy-800 border-r border-navy-border flex flex-col overflow-y-auto">
        <QRCodePanel url={VOTE_URL} />
        <AdminControls
          state={state}
          currentMatch={currentMatch}
          onOpenVoting={openVoting}
          onCloseVoting={closeVoting}
          onDeclareWinner={declareWinner}
          onInitialize={initialize}
          onReset={handleReset}
        />
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto p-5 flex flex-col gap-6 min-w-0">

        {/* Error banner */}
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 text-xs rounded-lg px-4 py-2">
            Firebase error: {error}
          </div>
        )}

        {/* Header */}
        <header className="flex items-center gap-3 flex-wrap">
          <h1 className="text-xl font-black tracking-tight text-white">
            🎬 Video Bracket Championship
          </h1>
          {state.votingOpen && (
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-knicks-orange text-knicks-orange bg-knicks-orange/10 animate-pulse-voting">
              ● VOTING OPEN
            </span>
          )}
        </header>

        {/* Champion screen */}
        {state.champion ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
            <div className="text-6xl mb-4">🎊</div>
            <p className="text-[11px] uppercase tracking-widest text-slate-500 mb-2">Tournament Champion</p>
            <h2 className="text-4xl font-black text-knicks-orange">{state.champion.title}</h2>
          </div>

        /* Current match */
        ) : currentMatch ? (
          <section className="bg-navy-800 border border-navy-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-knicks-blue text-white px-3 py-1 rounded-full">
                {roundLabel}
              </span>
              <h2 className="font-bold text-sm text-slate-300">Current Match</h2>
            </div>

            {/* Videos side-by-side */}
            <div className="flex gap-4 items-start">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-center mb-2 text-knicks-blue truncate">
                  {currentMatch.video1?.title ?? 'TBD'}
                </p>
                <VideoPlayer ytId={currentMatch.video1?.ytId} title={currentMatch.video1?.title} />
              </div>

              <div className="text-2xl font-black text-slate-600 self-center flex-shrink-0 pt-6">VS</div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-center mb-2 text-knicks-orange truncate">
                  {currentMatch.video2?.title ?? 'TBD'}
                </p>
                <VideoPlayer ytId={currentMatch.video2?.ytId} title={currentMatch.video2?.title} />
              </div>
            </div>

            {/* Vote bar */}
            {(currentMatch.votes1 > 0 || currentMatch.votes2 > 0) && (
              <VoteBar
                votes1={currentMatch.votes1}
                votes2={currentMatch.votes2}
                label1={currentMatch.video1?.title ?? 'Video 1'}
                label2={currentMatch.video2?.title ?? 'Video 2'}
              />
            )}
          </section>

        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-slate-500 text-sm">No tournament in progress. Use admin panel to start.</p>
          </div>
        )}

        {/* Full bracket */}
        <section>
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">
            Full Bracket
          </h2>
          <div className="overflow-x-auto pb-2 border border-navy-border rounded-xl bg-navy-800">
            <Bracket matches={matches} currentMatchId={state.currentMatchId} />
          </div>
        </section>
      </main>
    </div>
  );
}
