import React, { useState } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:4350' });

export default function Cleanup() {
  const [status, setStatus] = useState('');
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');

  const runCleanup = async () => {
    setRunning(true);
    setStatus('');
    setError('');
    try {
      const res = await api.post('/api/cleanup');
      setStatus(`Removed ${res.data.result.removedItems} items at ${res.data.result.timestamp}`);
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
          <h2 className="text-xl font-semibold">Cleanup</h2>
          <p className="text-xs text-slate-400">Clear temp files, prefetch and caches safely</p>
        </div>
        <button className="button-primary" onClick={runCleanup} disabled={running}>
          {running ? 'Cleaning...' : 'Run Cleanup'}
        </button>
      </div>
      {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
      {status && <div className="text-green-400 text-sm">{status}</div>}
    </section>
  );
}
