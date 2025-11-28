module.exports = (runPowerShell, cache) => {
  const router = require('express').Router();

  router.get('/', async (_req, res) => {
    try {
      const cached = cache.get('systemStats');
      if (cached) return res.json(cached);
      const stats = await runPowerShell('get-system-stats.ps1');
      cache.set('systemStats', stats);
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
