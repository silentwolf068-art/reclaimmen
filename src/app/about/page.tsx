import React from 'react';
import { Shield, Target, Flame, HeartHandshake, EyeOff, Lock } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">ABOUT RECLAIM MEN</h1>
        <p className="text-sm text-zinc-300 max-w-lg mx-auto">
          Take Back Control of your attention, energy, time, and habits.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-6 text-sm text-zinc-300 leading-relaxed">
        <h2 className="text-2xl font-extrabold text-white">OUR CORE PHILOSOPHY</h2>
        <p>
          The central challenge facing modern men is not simply pornography or masturbation — it is the systemic loss of control over attention, focus, and impulses caused by hyper-stimulating algorithms and infinite digital feeds.
        </p>
        <p>
          RECLAIM MEN was built to help men move from:
        </p>
        <ul className="list-disc list-inside space-y-2 text-zinc-200 font-medium pl-2">
          <li><strong className="text-emerald-400">Compulsion</strong> → Intention</li>
          <li><strong className="text-emerald-400">Constant Stimulation</strong> → Tolerance for Boredom</li>
          <li><strong className="text-emerald-400">Passive Consumption</strong> → Active Creation</li>
          <li><strong className="text-emerald-400">Inconsistency</strong> → Daily Discipline</li>
          <li><strong className="text-emerald-400">Isolation</strong> → Serious Community</li>
        </ul>
        <p>
          We strictly reject toxic masculinity, humiliation, shame-based rhetoric, superiority, and misogyny. The tone of RECLAIM MEN is serious, disciplined, supportive, mature, and psychologically intelligent.
        </p>
      </div>

      {/* ANTI-DOPAMINE DESIGN STATEMENT */}
      <div className="glass-card p-6 rounded-2xl border border-amber-500/30 bg-amber-950/20 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
          <EyeOff className="w-5 h-5" />
          ANTI-DOPAMINE PRODUCT DESIGN
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          RECLAIM MEN is designed to make itself less necessary over time. We do not build infinite scrolls, addictive notification loops, follower counts, or engagement traps. Your daily roll call takes 30-60 seconds so you can spend less time on screens and live better offline.
        </p>
      </div>
    </div>
  );
}
