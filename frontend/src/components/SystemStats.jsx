import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CPUPie from './Charts/CPUPie';
import RamBar from './Charts/RamBar';
import TempGauge from './Charts/TempGauge';

const api = axios.create({ baseURL: 'http://localhost:4350' });

export default function SystemStats() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/system');
        if (mounted) {
          setData(res.data);
          setError('');
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchStats();
    const id = setInterval(fetchStats, 1000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  return (
    <section className="card">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-xl font-semibold">Live System Stats</h2>
          <p className="text-xs text-slate-400">CPU, RAM, GPU load updated every second</p>
        </div>
        {data && <span className="text-xs text-slate-500">{new Date(data.timestamp).toLocaleTimeString()}</span>}
      </div>
      {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
      {!data ? (
        <div className="text-sm text-slate-400">Loading system data...</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card">
            <CPUPie value={data.cpuLoad} />
          </div>
          <div className="card">
            <RamBar used={data.memory.used} total={data.memory.total} percent={data.memory.percent} />
          </div>
          <div className="card flex flex-col gap-4">
            <TempGauge temp={data.temperatureC} />
            <div className="flex justify-between text-sm text-slate-300"><span>GPU Load</span><span>{data.gpuLoad}%</span></div>
          </div>
        </div>
      )}
    </section>
  );
}
