import React from 'react';
import SystemStats from './components/SystemStats';
import ProcessManager from './components/ProcessManager';
import Cleanup from './components/Cleanup';
import FPSBooster from './components/FPSBooster';
import AILab from './components/AILab';
import InstallerWizard from './components/InstallerWizard';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="bg-slate-950 border-b border-slate-800 shadow-lg sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-primary">Lashun Tweak Pro PRO EDITION</h1>
            <p className="text-sm text-slate-400">Windows PC Tweaker with live stats and automation</p>
          </div>
          <div className="text-xs text-slate-400">Backend @ http://localhost:4350</div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        <InstallerWizard />
        <SystemStats />
        <ProcessManager />
        <Cleanup />
        <FPSBooster />
        <AILab />
      </main>
    </div>
  );
}
