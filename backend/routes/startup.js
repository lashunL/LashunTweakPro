module.exports = (runPowerShell, sanitizeString) => {
  const router = require('express').Router();

  router.get('/', async (_req, res) => {
    try {
      const items = await runPowerShell('startup-list.ps1');
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/disable', async (req, res) => {
    try {
      const name = sanitizeString(req.body.name);
      if (!name) return res.status(400).json({ error: 'Invalid startup item name' });
      const result = await runPowerShell('startup-disable.ps1', ['-Name', name]);
      res.json({ success: true, result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
