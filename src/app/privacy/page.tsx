import React from 'react';
import { Lock, ShieldCheck, Eye, Trash2, Key } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <Lock className="w-3.5 h-3.5" />
          <span>DATA PRIVACY ARCHITECTURE</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">PRIVACY & ANONYMITY POLICY</h1>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Privacy is a fundamental product feature, not an afterthought.
        </p>
      </div>

      <div className="space-y-4 text-xs text-zinc-300">
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            1. Anonymous Public Identity
          </h3>
          <p>
            When you create an account, RECLAIM MEN automatically generates a non-sequential public identifier such as <code className="text-emerald-400 font-mono">ARC-7F29K4</code>. This is the only identifier visible on public community roll calls, active streak listings, and feed reflections.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400" />
            2. Private Journal Isolation
          </h3>
          <p>
            Your 10-minute end-of-day journal entries and reflections are strictly isolated to your private account. They are never exposed to community feeds, never made public, and never analyzed for advertising.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-indigo-400" />
            3. Aggregated Community Statistics
          </h3>
          <p>
            All public roll call numbers (check-in percentages, rule adherence rates) are aggregated across the entire community. We never publicly report individual missed commitments or sensitive personal adherence data.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-rose-400" />
            4. Full Account & Data Deletion
          </h3>
          <p>
            You retain full ownership of your data. You may request or trigger complete account and data deletion at any time via your account settings.
          </p>
        </div>
      </div>
    </div>
  );
}
