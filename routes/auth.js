const router = require('express').Router();
const { db } = require('../db/database');
const { startRoundTimer, getPlayer } = require('../services/progression');

router.post('/register', (req, res) => {
  const { name, pc_number } = req.body;
  if (!name || !pc_number) return res.status(400).json({ error: 'name and pc_number required' });
  const cleanName = String(name).trim().slice(0, 60);
  const cleanPC = String(pc_number).trim().slice(0, 30);
  if (!cleanName || !cleanPC) return res.status(400).json({ error: 'invalid input' });

  const now = Date.now();
  const info = db.prepare(
    `INSERT INTO players (name, pc_number, current_round, total_score, start_time, last_active)
     VALUES (?, ?, 1, 0, ?, ?)`
  ).run(cleanName, cleanPC, now, now);

  req.session.playerId = info.lastInsertRowid;
  startRoundTimer(info.lastInsertRowid, 1);
  res.json({ ok: true, redirect: '/challenge/1' });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

router.get('/me', (req, res) => {
  if (!req.session.playerId) return res.json({ player: null });
  res.json({ player: getPlayer(req.session.playerId) });
});

module.exports = router;
