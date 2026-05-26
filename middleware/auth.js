function requireAuth(req, res, next) {
  if (!req.session.playerId) {
    if (req.path.startsWith('/api/')) return res.status(401).json({ error: 'unauthorized' });
    return res.redirect('/');
  }
  next();
}

function requireRoundAccess(roundNumber) {
  return (req, res, next) => {
    const { getPlayer } = require('../services/progression');
    const player = getPlayer(req.session.playerId);
    if (!player) return res.redirect('/');
    if (player.solved_challenges.includes(roundNumber)) {
      return res.redirect(`/success/${roundNumber}`);
    }
    if (roundNumber > player.current_round) {
      return res.redirect(`/challenge/${player.current_round}`);
    }
    next();
  };
}

module.exports = { requireAuth, requireRoundAccess };
