import React, { useEffect, useState } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:4350' });

export default function ProcessManager() {
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [killing, setKilling] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/process');
      setProcesses(res.data || []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const kill = async (pid) => {
    setKilling(pid);
    try {
      await api.post('/api/process/kill', { pid });
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setKilling(null);
    }
  };

  return (
    <section className="card">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-xl font-semibold">Process Manager</h2>
          <p className="text-xs text-slate-400">View and terminate active processes</p>
        </div>
        <button className="button-primary" onClick={load} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
      <div className="overflow-auto max-h-80">
        <table className="min-w-full text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="text-left py-1">Name</th>
              <th className="text-left py-1">PID</th>
              <th className="text-left py-1">CPU</th>
              <th className="text-left py-1">Memory</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {processes.map((p) => (
              <tr key={p.Id} className="border-b border-slate-800">
                <td className="py-1">{p.Name}</td>
                <td className="py-1">{p.Id}</td>
                <td className="py-1">{p.CPU?.toFixed ? p.CPU.toFixed(2) : p.CPU}</td>
                <td className="py-1">{(p.WS / 1e6).toFixed(2)} MB</td>
                <td className="py-1 text-right">
                  <button
                    className="text-sm px-3 py-1 rounded bg-red-500 hover:bg-red-600 disabled:opacity-50"
                    disabled={killing === p.Id}
                    onClick={() => kill(p.Id)}
                  >
                    {killing === p.Id ? 'Killing...' : 'Kill'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
