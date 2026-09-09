'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  ArrowRight,
  Flame,
  Clock,
  CheckCircle2,
  Lock,
  Users,
  Award,
  Zap,
  BookOpen,
  Calendar,
  Sparkles
} from 'lucide-react';
import { dataService } from '@/lib/dataService';
import { CommunityStats } from '@/types';

export default function LandingPage() {
  const [stats, setStats] = useState<CommunityStats | null>(null);

  useEffect(() => {
    setStats(dataService.getCommunityStats());
  }, []);

  const commitmentsList = [
    { title: 'No Pornography', desc: 'Eliminate artificial stimulation and rewrite neural pathways.', tag: 'Mental Clarity' },
    { title: 'No Masturbation', desc: 'Practice self-control and conserve vital energy.', tag: 'Self-Mastery' },
    { title: 'No Doom Scrolling', desc: 'Stop consuming infinite short-form video feeds.', tag: 'Attention Control' },
    { title: 'Wake Up at 5:00 AM', desc: 'Win the morning before the rest of the world wakes up.', tag: 'Morning Routine' },
    { title: '10 Min Meditation', desc: 'Train stillness and become comfortable with quiet.', tag: 'Mindfulness' },
    { title: '10 Min Journaling', desc: 'End-of-day reflection. Private by default.', tag: 'Self-Awareness' },
    { title: 'Eat Without Entertainment', desc: 'No screens or videos while eating. Embrace presence.', tag: 'Dopamine Detox' },
    { title: 'Movement 5x / Week', desc: 'Gym, cardio, running, sports, or mobility work.', tag: 'Physical Power' }
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* HERO SECTION */}
      <section className="relative pt-12 md:pt-20 px-4 max-w-5xl mx-auto text-center overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-6">
          <Calendar className="w-3.5 h-3.5" />
          <span>WINTER ARC 2026 • 92 DAYS OF DISCIPLINE</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
          RECLAIM MEN
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400 font-black mt-2">
            TAKE BACK CONTROL.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto font-normal leading-relaxed mb-8">
          Not a generic habit tracker. Not just No Nut November.
          A serious discipline community for men to reduce stimulation, master attention, and build unbreakable routines.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href="/join"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-base flex items-center justify-center gap-2 transition-all glow-emerald"
          >
            <span>JOIN THE WINTER ARC</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/rules"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold text-base transition-colors"
          >
            THE 8 COMMITMENTS
          </Link>
        </div>

        {/* ANONYMITY PILL */}
        <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-900/80 border border-zinc-800/80 px-4 py-2 rounded-lg">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>Privacy First: Anonymous Public Identity assigned automatically (e.g. ARC-7F29K4)</span>
        </div>
      </section>

      {/* LIVE COMMUNITY STATS BANNER */}
      {stats && (
        <section className="max-w-6xl mx-auto px-4">
          <div className="glass-panel rounded-2xl p-6 md:p-8 border border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-extrabold text-white font-mono">
                {stats.totalMembers.toLocaleString()}
              </div>
              <div className="text-xs text-zinc-400 uppercase tracking-wider mt-1">ARC Members</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold text-emerald-400 font-mono">
                {stats.checkedInToday.toLocaleString()}
              </div>
              <div className="text-xs text-zinc-400 uppercase tracking-wider mt-1">Checked In Today</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold text-amber-400 font-mono">
                {stats.streaksByTier.sevenPlus.toLocaleString()}
              </div>
              <div className="text-xs text-zinc-400 uppercase tracking-wider mt-1">7+ Day Streaks</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold text-indigo-400 font-mono">
                {stats.communityAdherencePct}%
              </div>
              <div className="text-xs text-zinc-400 uppercase tracking-wider mt-1">Community Adherence</div>
            </div>
          </div>
        </section>
      )}

      {/* PHILOSOPHY SHIFT GRID */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">THE PHILOSOPHY SHIFT</h2>
          <p className="text-sm text-zinc-400">Moving from mindless compulsion to conscious intention.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { from: 'Compulsion', to: 'Intention', text: 'Decide how you spend your energy rather than reacting to notifications.' },
            { from: 'Constant Stimulation', to: 'Tolerance for Boredom', text: 'Become comfortable with quiet moments without needing a screen.' },
            { from: 'Passive Consumption', to: 'Active Creation', text: 'Stop consuming other people’s lives and build your own vision.' },
            { from: 'Isolation', to: 'Discipline Community', text: 'Stand alongside thousands of men striving for self-mastery.' }
          ].map((item, idx) => (
            <div key={idx} className="glass-card p-6 rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-sm font-mono font-bold">
                <span className="text-rose-400 line-through">{item.from}</span>
                <ArrowRight className="w-4 h-4 text-zinc-500" />
                <span className="text-emerald-400 font-extrabold text-base">{item.to}</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* THE 8 DAILY COMMITMENTS */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-mono">
            <Zap className="w-4 h-4" />
            <span>DAILY ROLL CALL PROTOCOL</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">THE 8 DAILY COMMITMENTS</h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            Simple, uncompromising non-negotiables to reclaim your physical, mental, and emotional sovereignty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {commitmentsList.map((c, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-xl border border-white/10 flex flex-col justify-between hover:border-emerald-500/40 transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-zinc-500">RULE 0{idx + 1}</span>
                  <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                    {c.tag}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{c.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">{c.desc}</p>
              </div>
              <div className="pt-3 border-t border-white/5 flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tracked Daily</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="glass-panel rounded-2xl p-8 md:p-12 border border-emerald-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            YOU DON'T NEED TO WAIT FOR MONDAY.
          </h2>
          <p className="text-zinc-300 text-sm md:text-base max-w-lg mx-auto mb-8">
            Your 92-day personal arc begins the moment you decide to take back control. Day 1 is today.
          </p>
          <Link
            href="/join"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-base transition-all glow-emerald"
          >
            <span>JOIN THE ARC NOW</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
