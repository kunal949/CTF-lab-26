const router = require('express').Router();
const path = require('path');
const { requireAuth } = require('../middleware/auth');
const { getPlayer } = require('../services/progression');

router.use(requireAuth);

for (let i = 1; i <= 10; i++) {
  router.get(`/${i}`, (req, res) => {
    const player = getPlayer(req.session.playerId);
    if (!player || !player.solved_challenges.includes(i)) {
      return res.redirect(`/challenge/${player ? player.current_round : 1}`);
    }
    res.sendFile(path.join(__dirname, '..', 'views', 'success.html'));
  });
}

module.exports = router;
