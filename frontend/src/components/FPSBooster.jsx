import React, { useState } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:4350' });

export default function FPSBooster() {
  const [status, setStatus] = useState('');
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');

  const runBoost = async () => {
    setRunning(true);
    setStatus('');
    setError('');
    try {
      const res = await api.post('/api/fps/boost');
      setStatus(res.data.result.message);
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
          <h2 className="text-xl font-semibold">FPS Boost</h2>
          <p className="text-xs text-slate-400">Power plan, GPU scheduling and multimedia tweaks</p>
        </div>
        <button className="button-primary" onClick={runBoost} disabled={running}>
          {running ? 'Applying...' : 'Apply Boost'}
        </button>
      </div>
      {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
      {status && <div className="text-green-400 text-sm">{status}</div>}
    </section>
  );
}
