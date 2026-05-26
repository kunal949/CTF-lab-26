const router = require('express').Router();
const { db } = require('../db/database');
const { requireAuth } = require('../middleware/auth');
const { getPlayer, validateSubmission } = require('../services/progression');

router.use(requireAuth);

router.get('/player', (req, res) => {
  const p = getPlayer(req.session.playerId);
  if (!p) return res.status(404).json({ error: 'no player' });
  res.json({ player: p });
});

router.post('/submit-flag', (req, res) => {
  const { round, flag } = req.body;
  const r = parseInt(round, 10);
  if (!r || r < 1 || r > 10) return res.status(400).json({ error: 'invalid round' });
  const result = validateSubmission(req.session.playerId, r, flag);
  if (!result.ok) return res.status(400).json({ ok: false, error: 'incorrect' });
  res.json({ ok: true, redirect: `/success/${r}`, score: result.score });
});

router.get('/leaderboard', (req, res) => {
  const rows = db.prepare(
    `SELECT name, pc_number, total_score, current_round, total_elapsed_seconds, last_active, completion_time
     FROM players ORDER BY total_score DESC, total_elapsed_seconds ASC LIMIT 100`
  ).all();
  res.json({ leaderboard: rows });
});

module.exports = router;
