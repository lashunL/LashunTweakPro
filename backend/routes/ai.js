const optimizer = require('../ai/optimizer');

module.exports = (sanitizeString) => {
  const router = require('express').Router();

  router.post('/optimize', (req, res) => {
    try {
      const profile = sanitizeString(req.body.profile || 'balanced');
      const sliders = req.body.sliders || {};
      const result = optimizer(profile, sliders);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
