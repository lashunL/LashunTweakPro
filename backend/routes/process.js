module.exports = (runPowerShell, sanitizeString) => {
  const router = require('express').Router();

  router.get('/', async (_req, res) => {
    try {
      const processes = await runPowerShell('list-processes.ps1');
      res.json(processes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/kill', async (req, res) => {
    try {
      const pid = Number(req.body.pid);
      if (!Number.isInteger(pid) || pid <= 0) {
        return res.status(400).json({ error: 'Invalid PID' });
      }
      const result = await runPowerShell('kill-process.ps1', ['-Pid', pid]);
      res.json({ success: true, result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
