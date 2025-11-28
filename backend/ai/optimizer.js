const path = require('path');
const fs = require('fs');

const configPath = path.join(__dirname, '..', 'backend-data', 'ai-profile.json');

const defaultWeights = {
  balanced: { cpu: 0.5, gpu: 0.5, memory: 0.5, services: 0.5 },
  performance: { cpu: 0.85, gpu: 0.9, memory: 0.7, services: 0.8 },
  battery: { cpu: 0.3, gpu: 0.2, memory: 0.4, services: 0.6 }
};

function clamp(val, min = 0, max = 1) {
  return Math.min(Math.max(val, min), max);
}

function saveProfile(profile, weights) {
  const payload = { profile, weights, updated: new Date().toISOString() };
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(configPath, JSON.stringify(payload, null, 2));
  return payload;
}

function computeAdjustments(profile, sliders) {
  const base = defaultWeights[profile] || defaultWeights.balanced;
  const overrides = {
    cpu: clamp(Number(sliders.cpu) || base.cpu),
    gpu: clamp(Number(sliders.gpu) || base.gpu),
    memory: clamp(Number(sliders.memory) || base.memory),
    services: clamp(Number(sliders.services) || base.services)
  };

  const suggestions = [];
  if (overrides.cpu > 0.7) suggestions.push('Set power plan to High performance');
  else if (overrides.cpu < 0.4) suggestions.push('Set power plan to Balanced');

  if (overrides.gpu > 0.7) suggestions.push('Prefer GPU scheduling and latest drivers');
  if (overrides.memory > 0.6) suggestions.push('Enable large system cache and clear standby list');
  if (overrides.services > 0.6) suggestions.push('Disable non-essential startup services');

  const score = Math.round((overrides.cpu + overrides.gpu + overrides.memory + overrides.services) / 4 * 100);

  return { overrides, suggestions, score };
}

module.exports = function optimizer(profile = 'balanced', sliders = {}) {
  const cleanProfile = ['balanced', 'performance', 'battery'].includes(profile) ? profile : 'balanced';
  const adjustments = computeAdjustments(cleanProfile, sliders);
  const saved = saveProfile(cleanProfile, adjustments.overrides);
  return {
    profile: cleanProfile,
    score: adjustments.score,
    suggestions: adjustments.suggestions,
    weights: adjustments.overrides,
    savedAt: saved.updated
  };
};
