const router = require('express').Router();
const path = require('path');
const { db } = require('../db/database');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

function requireAdmin(req, res, next) {
  if (!req.session.isAdmin) {
    if (req.path.startsWith('/api') || req.method !== 'GET') return res.status(401).json({ error: 'unauthorized' });
    return res.redirect('/admin/login');
  }
  next();
}

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'admin-login.html'));
});

router.post('/login', (req, res) => {
  if (req.body.password === ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    return res.json({ ok: true, redirect: '/admin' });
  }
  res.status(401).json({ ok: false });
});

router.post('/logout', (req, res) => {
  req.session.isAdmin = false;
  res.json({ ok: true });
});

router.get('/', requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'admin.html'));
});

router.get('/data', requireAdmin, (req, res) => {
  const players = db.prepare('SELECT * FROM players ORDER BY id DESC').all().map(p => {
    p.solved_challenges = JSON.parse(p.solved_challenges || '[]');
    return p;
  });
  const submissions = db.prepare('SELECT * FROM submissions ORDER BY id DESC LIMIT 200').all();
  const metrics = db.prepare('SELECT * FROM round_metrics ORDER BY id DESC LIMIT 200').all();
  res.json({ players, submissions, metrics });
});

router.post('/reset/:id', requireAdmin, (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.prepare(`UPDATE players SET current_round=1, total_score=0, solved_challenges='[]',
              total_elapsed_seconds=0, completion_time=NULL, start_time=?, active_session=1 WHERE id=?`)
    .run(Date.now(), id);
  db.prepare('DELETE FROM round_metrics WHERE player_id=?').run(id);
  db.prepare('DELETE FROM submissions WHERE player_id=?').run(id);
  res.json({ ok: true });
});

router.post('/terminate/:id', requireAdmin, (req, res) => {
  db.prepare('UPDATE players SET active_session=0 WHERE id=?').run(parseInt(req.params.id, 10));
  res.json({ ok: true });
});

router.post('/unlock/:id', requireAdmin, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const round = parseInt(req.body.round, 10);
  if (!round || round < 1 || round > 10) return res.status(400).json({ error: 'invalid' });
  db.prepare('UPDATE players SET current_round=? WHERE id=?').run(round, id);
  res.json({ ok: true });
});

module.exports = router;
