import { db } from './config';
import { ref, set, get, update, onValue, runTransaction } from 'firebase/database';

// Where the winner's video gets placed in the next round
const ADVANCEMENT_MAP = {
  r1m1: { nextMatch: 'r2m1', slot: 1 },
  r1m2: { nextMatch: 'r2m1', slot: 2 },
  r1m3: { nextMatch: 'r2m2', slot: 1 },
  r1m4: { nextMatch: 'r2m2', slot: 2 },
  r1m5: { nextMatch: 'r2m3', slot: 1 },
  r1m6: { nextMatch: 'r2m3', slot: 2 },
  r1m7: { nextMatch: 'r2m4', slot: 1 },
  r1m8: { nextMatch: 'r2m4', slot: 2 },
  r2m1: { nextMatch: 'r3m1', slot: 1 },
  r2m2: { nextMatch: 'r3m1', slot: 2 },
  r2m3: { nextMatch: 'r3m2', slot: 1 },
  r2m4: { nextMatch: 'r3m2', slot: 2 },
  r3m1: { nextMatch: 'r4m1', slot: 1 },
  r3m2: { nextMatch: 'r4m1', slot: 2 },
};

// Which match is played next (sequential order through all rounds)
const NEXT_MATCH_MAP = {
  r1m1: 'r1m2', r1m2: 'r1m3', r1m3: 'r1m4', r1m4: 'r1m5',
  r1m5: 'r1m6', r1m6: 'r1m7', r1m7: 'r1m8', r1m8: 'r2m1',
  r2m1: 'r2m2', r2m2: 'r2m3', r2m3: 'r2m4', r2m4: 'r3m1',
  r3m1: 'r3m2', r3m2: 'r4m1',
  // r4m1 has no next — tournament over
};

function buildEmptyMatch(id, round, position) {
  return { id, round, position, video1: null, video2: null, votes1: 0, votes2: 0, winner: null };
}

function buildInitialMatches(videos) {
  const matches = {};

  // Round 1: pair up the 16 videos into 8 matches
  for (let i = 0; i < 8; i++) {
    const id = `r1m${i + 1}`;
    matches[id] = {
      id, round: 0, position: i,
      video1: videos[i * 2],
      video2: videos[i * 2 + 1],
      votes1: 0, votes2: 0, winner: null,
    };
  }

  // Round 2
  ['r2m1', 'r2m2', 'r2m3', 'r2m4'].forEach((id, i) => {
    matches[id] = buildEmptyMatch(id, 1, i);
  });

  // Semifinals
  ['r3m1', 'r3m2'].forEach((id, i) => {
    matches[id] = buildEmptyMatch(id, 2, i);
  });

  // Final
  matches['r4m1'] = buildEmptyMatch('r4m1', 3, 0);

  return matches;
}

export async function initializeTournament(videos) {
  const matches = buildInitialMatches(videos);
  await set(ref(db, 'tournament'), {
    state: { currentMatchId: 'r1m1', votingOpen: false, champion: null },
    matches,
    voters: {},
  });
}

export function subscribeToTournament(callback) {
  const tournamentRef = ref(db, 'tournament');
  const unsubscribe = onValue(tournamentRef, (snapshot) => {
    callback(snapshot.val());
  });
  return unsubscribe;
}

export async function setVotingOpen(open) {
  await update(ref(db, 'tournament/state'), { votingOpen: open });
}

export async function castVote(matchId, videoSlot, deviceId) {
  const voterRef = ref(db, `tournament/voters/${matchId}/${deviceId}`);
  const existing = await get(voterRef);

  if (existing.exists()) {
    return { success: false, alreadyVoted: true };
  }

  const voteField = videoSlot === 1 ? 'votes1' : 'votes2';
  const matchVoteRef = ref(db, `tournament/matches/${matchId}/${voteField}`);

  await runTransaction(matchVoteRef, (current) => (current || 0) + 1);
  await set(voterRef, videoSlot);

  return { success: true };
}

export async function advanceWinner(matchId, winnerSlot) {
  const matchSnap = await get(ref(db, `tournament/matches/${matchId}`));
  const match = matchSnap.val();
  const winner = winnerSlot === 1 ? match.video1 : match.video2;

  const updates = {
    [`tournament/matches/${matchId}/winner`]: winnerSlot,
    'tournament/state/votingOpen': false,
  };

  // Place winner into the correct next-round match slot
  const advancement = ADVANCEMENT_MAP[matchId];
  if (advancement) {
    const { nextMatch, slot } = advancement;
    updates[`tournament/matches/${nextMatch}/video${slot}`] = winner;
  } else {
    // Final match — set champion
    updates['tournament/state/champion'] = winner;
  }

  // Advance the active match pointer sequentially through all matches
  const nextMatchId = NEXT_MATCH_MAP[matchId];
  if (nextMatchId) {
    updates['tournament/state/currentMatchId'] = nextMatchId;
  } else {
    updates['tournament/state/currentMatchId'] = null;
  }

  await update(ref(db, '/'), updates);
}

export async function resetTournament(videos) {
  await initializeTournament(videos);
}
