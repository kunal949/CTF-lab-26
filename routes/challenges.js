const router = require('express').Router();
const path = require('path');
const { requireAuth, requireRoundAccess } = require('../middleware/auth');

router.use(requireAuth);

for (let i = 1; i <= 10; i++) {
  router.get(`/${i}`, requireRoundAccess(i), (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'challenges', `challenge${i}`, 'index.html'));
  });
}

module.exports = router;
