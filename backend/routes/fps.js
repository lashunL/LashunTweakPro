module.exports = (runPowerShell) => {
  const router = require('express').Router();

  router.post('/boost', async (_req, res) => {
    try {
      const result = await runPowerShell('fps-boost.ps1');
      res.json({ success: true, result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
