'use client';

import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Users,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Award,
  BarChart3,
  Calendar
} from 'lucide-react';
import { dataService } from '@/lib/dataService';
import { AdminAnalytics } from '@/types';

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);

  useEffect(() => {
    async function loadAnalytics() {
      const res = await dataService.getAdminAnalytics();
      setAnalytics(res);
    }
    loadAnalytics();
  }, []);

  if (!analytics) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-zinc-400 font-mono">Loading Admin Sovereign Analytics...</p>
      </div>
    );
  }

  const missedRulesList = [
    { rule: 'Wake Up at 5:00 AM', missRate: analytics.ruleMissRates.wake5am, color: 'bg-rose-500' },
    { rule: 'No Doom Scrolling', missRate: analytics.ruleMissRates.noDoomscrolling, color: 'bg-amber-500' },
    { rule: '10 Min Meditation', missRate: analytics.ruleMissRates.meditation, color: 'bg-indigo-500' },
    { rule: 'Eat Without Entertainment', missRate: analytics.ruleMissRates.noFoodEntertainment, color: 'bg-teal-500' },
    { rule: 'No Pornography', missRate: analytics.ruleMissRates.noPorn, color: 'bg-emerald-500' },
    { rule: 'No Masturbation', missRate: analytics.ruleMissRates.noMasturbation, color: 'bg-emerald-600' },
    { rule: '10 Min Journaling', missRate: analytics.ruleMissRates.journaling, color: 'bg-cyan-500' },
    { rule: 'Movement (5x / week)', missRate: analytics.ruleMissRates.movement, color: 'bg-blue-500' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* ADMIN HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>PROTECTED ADMIN SYSTEM</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">BEHAVIORAL ANALYTICS DASHBOARD</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time cohort retention, adherence metrics, and rule failure diagnostics.
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
          SYSTEM HEALTH: 100% OPERATIONAL
        </div>
      </div>

      {/* OVERVIEW STAT CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
          <div className="text-xs text-zinc-400 uppercase tracking-wider font-mono">TOTAL MEMBERS</div>
          <div className="text-3xl font-black text-white font-mono">{analytics.totalMembers.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-400 font-mono">+{analytics.newMembersToday} joined today</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
          <div className="text-xs text-zinc-400 uppercase tracking-wider font-mono">CHECK-IN RATE</div>
          <div className="text-3xl font-black text-emerald-400 font-mono">{analytics.dailyCheckinRate}%</div>
          <div className="text-[10px] text-zinc-500 font-mono">Active daily participation</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
          <div className="text-xs text-zinc-400 uppercase tracking-wider font-mono">AVERAGE SCORE</div>
          <div className="text-3xl font-black text-amber-400 font-mono">{analytics.averageScore} <span className="text-zinc-500 text-xs font-normal">/ 8</span></div>
          <div className="text-[10px] text-zinc-500 font-mono">Across all roll calls</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
          <div className="text-xs text-zinc-400 uppercase tracking-wider font-mono">ACTIVE MEMBERS</div>
          <div className="text-3xl font-black text-indigo-400 font-mono">{analytics.activeMembers.toLocaleString()}</div>
          <div className="text-[10px] text-zinc-500 font-mono">Active in past 7 days</div>
        </div>
      </div>

      {/* RULE FAILURE DIAGNOSTICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            MOST FREQUENTLY MISSED COMMITMENTS
          </h3>
          <p className="text-xs text-zinc-400">
            Identifies which behavioral rules present the greatest friction for community members.
          </p>

          <div className="space-y-3 pt-2 font-mono text-xs">
            {missedRulesList.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-zinc-300">
                  <span>{item.rule}</span>
                  <span className="font-bold text-white">{item.missRate}% Missed</span>
                </div>
                <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color}`}
                    style={{ width: `${item.missRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COHORT RETENTION FUNNEL */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider font-mono flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            ARC COHORT RETENTION FUNNEL
          </h3>
          <p className="text-xs text-zinc-400">
            Percentage of members maintaining active daily roll call adherence over time.
          </p>

          <div className="space-y-3 pt-2 font-mono text-xs">
            {[
              { day: 'Day 1 Signup', rate: analytics.retentionRates.day1 },
              { day: 'Day 3 Spark', rate: analytics.retentionRates.day3 },
              { day: 'Day 7 First Shield', rate: analytics.retentionRates.day7 },
              { day: 'Day 14 Two Weeks', rate: analytics.retentionRates.day14 },
              { day: 'Day 21 Mindset Shift', rate: analytics.retentionRates.day21 },
              { day: 'Day 30 Iron Month', rate: analytics.retentionRates.day30 },
              { day: 'Day 60 Iron Mind', rate: analytics.retentionRates.day60 },
              { day: 'Day 92 Winter Arc Complete 👑', rate: analytics.retentionRates.day92 }
            ].map((cohort, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-zinc-300">
                  <span>{cohort.day}</span>
                  <span className="font-bold text-emerald-400">{cohort.rate}% Retained</span>
                </div>
                <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                    style={{ width: `${cohort.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
