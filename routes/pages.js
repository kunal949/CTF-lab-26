const router = require('express').Router();
const path = require('path');
const { requireAuth } = require('../middleware/auth');
const { getPlayer } = require('../services/progression');

router.get('/', (req, res) => {
  if (req.session.playerId) {
    const p = getPlayer(req.session.playerId);
    if (p && p.solved_challenges.length === 10) return res.redirect('/evaluation-complete');
    if (p) return res.redirect(`/challenge/${p.current_round}`);
  }
  res.sendFile(path.join(__dirname, '..', 'views', 'register.html'));
});

router.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'dashboard.html'));
});

router.get('/leaderboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'leaderboard.html'));
});

router.get('/evaluation-complete', requireAuth, (req, res) => {
  const p = getPlayer(req.session.playerId);
  if (!p || p.solved_challenges.length < 10) return res.redirect('/dashboard');
  res.sendFile(path.join(__dirname, '..', 'views', 'evaluation-complete.html'));
});

module.exports = router;
