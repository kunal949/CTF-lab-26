const { db } = require('../db/database');
const FLAGS = require('./flags');

function getPlayer(playerId) {
  const p = db.prepare('SELECT * FROM players WHERE id = ?').get(playerId);
  if (p) p.solved_challenges = JSON.parse(p.solved_challenges || '[]');
  return p;
}

function startRoundTimer(playerId, roundNumber) {
  const existing = db.prepare(
    'SELECT * FROM round_metrics WHERE player_id = ? AND round_number = ? AND end_time IS NULL'
  ).get(playerId, roundNumber);
  if (existing) return existing;
  const now = Date.now();
  db.prepare(
    'INSERT INTO round_metrics (player_id, round_number, start_time) VALUES (?, ?, ?)'
  ).run(playerId, roundNumber, now);
}

function completeRoundTimer(playerId, roundNumber) {
  const row = db.prepare(
    'SELECT * FROM round_metrics WHERE player_id = ? AND round_number = ? AND end_time IS NULL ORDER BY id DESC LIMIT 1'
  ).get(playerId, roundNumber);
  if (!row) return 0;
  const now = Date.now();
  const elapsed = Math.floor((now - row.start_time) / 1000);
  db.prepare('UPDATE round_metrics SET end_time = ?, elapsed_seconds = ? WHERE id = ?')
    .run(now, elapsed, row.id);
  return elapsed;
}

function markChallengeSolved(playerId, roundNumber, submittedFlag) {
  const player = getPlayer(playerId);
  if (!player) return { ok: false, reason: 'no-player' };
  if (player.solved_challenges.includes(roundNumber)) {
    return { ok: true, already: true };
  }
  if (roundNumber !== player.current_round) {
    return { ok: false, reason: 'wrong-round' };
  }

  const elapsed = completeRoundTimer(playerId, roundNumber);
  const solved = [...player.solved_challenges, roundNumber];
  const nextRound = Math.min(roundNumber + 1, 10);
  const newScore = player.total_score + FLAGS.SCORE_PER_ROUND;
  const completionTime = roundNumber === 10 ? Date.now() : null;
  const totalElapsed = (player.total_elapsed_seconds || 0) + elapsed;

  db.prepare(`UPDATE players
    SET solved_challenges = ?, current_round = ?, total_score = ?,
        completion_time = COALESCE(?, completion_time),
        total_elapsed_seconds = ?, last_active = ?
    WHERE id = ?`)
    .run(JSON.stringify(solved), nextRound, newScore, completionTime, totalElapsed, Date.now(), playerId);

  db.prepare('INSERT INTO submissions (player_id, round_number, submitted_flag, is_correct, timestamp) VALUES (?,?,?,?,?)')
    .run(playerId, roundNumber, submittedFlag, 1, Date.now());

  if (roundNumber < 10) startRoundTimer(playerId, nextRound);
  return { ok: true, elapsed, score: newScore, nextRound };
}

function validateSubmission(playerId, roundNumber, submittedFlag) {
  const expected = FLAGS[roundNumber];
  const correct = expected && submittedFlag && submittedFlag.trim() === expected;
  if (!correct) {
    db.prepare('INSERT INTO submissions (player_id, round_number, submitted_flag, is_correct, timestamp) VALUES (?,?,?,?,?)')
      .run(playerId, roundNumber, submittedFlag || '', 0, Date.now());
    return { ok: false };
  }
  return markChallengeSolved(playerId, roundNumber, submittedFlag);
}

module.exports = { getPlayer, startRoundTimer, completeRoundTimer, markChallengeSolved, validateSubmission };
