import { useState, useEffect } from 'react';
import { useTournament } from '../hooks/useTournament';
import { useDeviceId } from '../hooks/useDeviceId';
import { castVote } from '../firebase/tournamentDB';
import VideoPlayer from '../components/VideoPlayer';
import VoteBar from '../components/VoteBar';

const ROUND_LABELS = ['Round of 16', 'Quarterfinals', 'Semifinals', 'Final'];

export default function VotePage() {
  const { loading, state, currentMatch } = useTournament();
  const deviceId = useDeviceId();
  const [hasVoted, setHasVoted] = useState(false);
  const [votedFor, setVotedFor] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Reset vote state whenever the active match changes
  useEffect(() => {
    setHasVoted(false);
    setVotedFor(null);
    setSubmitting(false);
    setError(null);
  }, [currentMatch?.id]);

  const handleVote = async (slot) => {
    if (submitting || hasVoted) return;
    setSubmitting(true);
    setError(null);

    const result = await castVote(currentMatch.id, slot, deviceId);

    if (result.success) {
      setHasVoted(true);
      setVotedFor(slot);
    } else if (result.alreadyVoted) {
      setHasVoted(true);
      setError('You already voted in this match.');
    } else {
      setError('Something went wrong. Please try again.');
    }

    setSubmitting(false);
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <StatusScreen>
        <div className="w-10 h-10 rounded-full border-2 border-navy-border border-t-knicks-blue animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Connecting…</p>
      </StatusScreen>
    );
  }

  /* ── Not started ── */
  if (!currentMatch && !state?.champion) {
    return (
      <StatusScreen>
        <div className="text-5xl mb-4">⏳</div>
        <h2 className="text-xl font-bold text-white">Tournament hasn't started yet</h2>
        <p className="text-slate-400 text-sm mt-2">Check back soon!</p>
      </StatusScreen>
    );
  }

  /* ── Champion ── */
  if (state?.champion) {
    return (
      <StatusScreen>
        <div className="text-5xl mb-4">🏆</div>
        <h2 className="text-xl font-bold text-white">Tournament Over!</h2>
        <p className="text-knicks-orange font-bold text-lg mt-2">{state.champion.title}</p>
        <p className="text-slate-400 text-sm">is the champion!</p>
      </StatusScreen>
    );
  }

  /* ── Voting closed ── */
  if (!state?.votingOpen) {
    return (
      <StatusScreen>
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-xl font-bold text-white">Voting Closed</h2>
        <p className="text-slate-400 text-sm mt-2 max-w-xs">
          Hang tight — voting will open for the next match soon.
        </p>
        {currentMatch && (
          <div className="mt-5 bg-navy-800 border border-navy-border rounded-xl px-4 py-3 text-center max-w-xs">
            <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-1">Current match</p>
            <p className="text-sm font-semibold">
              <span className="text-knicks-blue">{currentMatch.video1?.title ?? 'TBD'}</span>
              <span className="text-slate-500 mx-2">vs</span>
              <span className="text-knicks-orange">{currentMatch.video2?.title ?? 'TBD'}</span>
            </p>
          </div>
        )}
      </StatusScreen>
    );
  }

  /* ── Already voted ── */
  if (hasVoted) {
    const chosenTitle = votedFor === 1 ? currentMatch.video1?.title : currentMatch.video2?.title;
    return (
      <StatusScreen>
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-bold text-white">Vote Recorded!</h2>
        {chosenTitle && (
          <p className="text-slate-300 text-sm mt-2">
            You voted for <strong className="text-knicks-orange">{chosenTitle}</strong>
          </p>
        )}
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        <div className="w-full max-w-sm mt-5">
          <VoteBar
            votes1={currentMatch.votes1}
            votes2={currentMatch.votes2}
            label1={currentMatch.video1?.title ?? 'Video 1'}
            label2={currentMatch.video2?.title ?? 'Video 2'}
          />
        </div>
        <p className="text-[11px] text-slate-600 mt-3">Results update in real time.</p>
      </StatusScreen>
    );
  }

  /* ── Active voting ── */
  const roundLabel = ROUND_LABELS[currentMatch.round] ?? 'Match';

  return (
    <div className="min-h-dvh bg-navy-900 flex flex-col">

      {/* Header */}
      <header className="bg-navy-800 border-b border-navy-border px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider bg-knicks-blue text-white px-3 py-0.5 rounded-full">
            {roundLabel}
          </span>
        </div>
        <h1 className="text-base font-bold text-white">Which video is better?</h1>
      </header>

      {/* Videos */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 md:flex-row md:items-start md:gap-6">

        {/* Video 1 */}
        <div className="bg-navy-800 border border-navy-border rounded-2xl p-4 md:flex-1">
          <p className="text-sm font-bold text-center text-knicks-blue mb-3">
            {currentMatch.video1?.title}
          </p>
          <VideoPlayer ytId={currentMatch.video1?.ytId} title={currentMatch.video1?.title} />
          <button
            className="mt-4 w-full py-3.5 rounded-xl bg-knicks-blue hover:bg-knicks-blue-d active:scale-95 text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleVote(1)}
            disabled={submitting}
          >
            {submitting ? '…' : `Vote: ${currentMatch.video1?.title}`}
          </button>
        </div>

        {/* VS divider */}
        <div className="text-2xl font-black text-slate-600 text-center self-center hidden md:block">VS</div>
        <div className="text-center text-slate-600 font-black md:hidden">— VS —</div>

        {/* Video 2 */}
        <div className="bg-navy-800 border border-navy-border rounded-2xl p-4 md:flex-1">
          <p className="text-sm font-bold text-center text-knicks-orange mb-3">
            {currentMatch.video2?.title}
          </p>
          <VideoPlayer ytId={currentMatch.video2?.ytId} title={currentMatch.video2?.title} />
          <button
            className="mt-4 w-full py-3.5 rounded-xl bg-knicks-orange hover:bg-knicks-orange-d active:scale-95 text-black font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleVote(2)}
            disabled={submitting}
          >
            {submitting ? '…' : `Vote: ${currentMatch.video2?.title}`}
          </button>
        </div>
      </div>
    </div>
  );
}

/* Shared centered status screen wrapper */
function StatusScreen({ children }) {
  return (
    <div className="min-h-dvh bg-navy-900 flex flex-col items-center justify-center px-6 text-center gap-2">
      {children}
    </div>
  );
}
