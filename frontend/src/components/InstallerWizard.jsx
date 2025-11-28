import React, { useEffect, useState } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:4350' });

const steps = [
  'Check PowerShell policy',
  'Create config folders',
  'Verify dependencies',
  'Save preferences'
];

export default function InstallerWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState([]);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const appendLog = (msg) => setLog((prev) => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);

  const runChecks = async () => {
    setError('');
    setLog([]);
    setDone(false);
    setProgress(0);
    let stepIndex = 0;
    try {
      appendLog('Verifying backend availability...');
      await api.get('/health');

      appendLog('Checking PowerShell execution policy...');
      stepIndex = 1;
      setCurrentStep(stepIndex);
      const policyCheck = await window.electronAPI?.checkPolicy?.();
      if (policyCheck && policyCheck.needsChange) {
        appendLog('Updating execution policy to RemoteSigned...');
        await window.electronAPI.fixPolicy();
      }
      setProgress(25);

      appendLog('Creating config directories...');
      stepIndex = 2;
      setCurrentStep(stepIndex);
      await window.electronAPI?.createConfig?.();
      setProgress(50);

      appendLog('Ensuring Node and PowerShell are available...');
      stepIndex = 3;
      setCurrentStep(stepIndex);
      const depCheck = await window.electronAPI?.checkDeps?.();
      if (depCheck?.missing && depCheck.missing.length) {
        throw new Error(`Missing dependencies: ${depCheck.missing.join(', ')}`);
      }
      setProgress(75);

      appendLog('Saving user preferences...');
      stepIndex = 4;
      setCurrentStep(stepIndex);
      await window.electronAPI?.savePreferences?.({ allowAnalytics: false });
      setProgress(100);

      setDone(true);
      appendLog('Setup complete.');
    } catch (err) {
      setError(err.message);
      appendLog(`Error: ${err.message}`);
    }
  };

  useEffect(() => {
    runChecks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="card">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-xl font-semibold">Installer & Setup Wizard</h2>
          <p className="text-xs text-slate-400">Runs automatically at startup to prepare your system</p>
        </div>
        <button className="button-primary" onClick={runChecks}>Re-run Checks</button>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-2 mb-3">
        <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
      </div>
      <ul className="text-sm text-slate-300 mb-3 grid md:grid-cols-2 gap-1">
        {steps.map((s, idx) => (
          <li key={s} className={idx <= currentStep ? 'text-primary' : ''}>{idx + 1}. {s}</li>
        ))}
      </ul>
      {done && <div className="text-green-400 text-sm mb-2">All checks passed.</div>}
      {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
      <div className="bg-slate-950 border border-slate-800 rounded p-3 text-xs max-h-36 overflow-auto">
        {log.map((l, idx) => (
          <div key={idx}>{l}</div>
        ))}
      </div>
    </section>
  );
}
