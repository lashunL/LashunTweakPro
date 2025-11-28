module.exports = (runPowerShell) => {
  const router = require('express').Router();

  router.post('/', async (_req, res) => {
    try {
      const result = await runPowerShell('cleanup.ps1');
      res.json({ success: true, result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
