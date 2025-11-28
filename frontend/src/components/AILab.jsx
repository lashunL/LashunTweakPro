import React, { useState } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:4350' });

export default function AILab() {
  const [profile, setProfile] = useState('balanced');
  const [sliders, setSliders] = useState({ cpu: 0.5, gpu: 0.5, memory: 0.5, services: 0.5 });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [running, setRunning] = useState(false);

  const updateSlider = (key, value) => {
    setSliders((prev) => ({ ...prev, [key]: Number(value) }));
  };

  const optimize = async () => {
    setRunning(true);
    setError('');
    try {
      const res = await api.post('/api/ai/optimize', { profile, sliders });
      setResult(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setRunning(false);
    }
  };

  return (
    <section className="card">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-xl font-semibold">AI Optimization</h2>
          <p className="text-xs text-slate-400">Adaptive tuning using your inputs</p>
        </div>
        <button className="button-primary" onClick={optimize} disabled={running}>
          {running ? 'Optimizing...' : 'Run Optimizer'}
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <label className="block text-sm">Profile</label>
          <select
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2"
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
          >
            <option value="balanced">Balanced</option>
            <option value="performance">Performance</option>
            <option value="battery">Battery Saver</option>
          </select>

          {['cpu', 'gpu', 'memory', 'services'].map((key) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-sm capitalize">
                <span>{key}</span>
                <span>{(sliders[key] * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={sliders[key]}
                onChange={(e) => updateSlider(key, e.target.value)}
                className="w-full accent-primary"
              />
            </div>
          ))}
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold">Result</h3>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          {result ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Profile</span><span>{result.profile}</span></div>
              <div className="flex justify-between"><span>Score</span><span>{result.score}</span></div>
              <div>
                <div className="text-slate-400 mb-1">Weights</div>
                <ul className="text-xs space-y-1">
                  {Object.entries(result.weights).map(([k, v]) => (
                    <li key={k} className="flex justify-between capitalize"><span>{k}</span><span>{(v * 100).toFixed(0)}%</span></li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-slate-400 mb-1">Suggestions</div>
                <ul className="list-disc list-inside space-y-1">
                  {result.suggestions.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="text-xs text-slate-500">Saved at {result.savedAt}</div>
            </div>
          ) : (
            <div className="text-sm text-slate-400">Adjust sliders and run optimizer to see recommendations.</div>
          )}
        </div>
      </div>
    </section>
  );
}
