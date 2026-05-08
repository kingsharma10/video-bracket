import { useState, useEffect, useCallback } from 'react';
import {
  subscribeToTournament,
  setVotingOpen,
  advanceWinner,
  resetTournament,
  initializeTournament,
} from '../firebase/tournamentDB';
import { DEFAULT_VIDEOS } from '../data/defaultVideos';

export function useTournament() {
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToTournament((data) => {
      setTournament(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const matches = tournament?.matches ?? {};
  const state = tournament?.state ?? {};
  const currentMatch = matches[state.currentMatchId] ?? null;

  const wrap = (fn) => async (...args) => {
    try {
      setError(null);
      await fn(...args);
    } catch (e) {
      console.error(e);
      setError(e.message ?? 'Unknown error');
    }
  };

  const openVoting    = useCallback(wrap(() => setVotingOpen(true)), []);
  const closeVoting   = useCallback(wrap(() => setVotingOpen(false)), []);
  const declareWinner = useCallback(wrap((slot) => advanceWinner(state.currentMatchId, slot)), [state.currentMatchId]);
  const initialize    = useCallback(wrap(() => initializeTournament(DEFAULT_VIDEOS)), []);
  const reset         = useCallback(wrap(() => resetTournament(DEFAULT_VIDEOS)), []);

  return {
    loading,
    error,
    tournament,
    matches,
    state,
    currentMatch,
    openVoting,
    closeVoting,
    declareWinner,
    initialize,
    reset,
  };
}
