'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Flame,
  Award,
  Calendar,
  CheckSquare,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  Lock
} from 'lucide-react';
import { dataService } from '@/lib/dataService';
import { calculatePersonalDay, getDaysRemainingInArc, TOTAL_ARC_DAYS } from '@/lib/dateUtils';
import { getNextMilestone } from '@/lib/badgeEngine';
import { UserProfile, DailyCheckin, UserStreak, MilestoneBadge } from '@/types';

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [todayCheckin, setTodayCheckin] = useState<DailyCheckin | null>(null);
  const [badges, setBadges] = useState<MilestoneBadge[]>([]);

  useEffect(() => {
    async function loadData() {
      const curUser = dataService.getCurrentUser();
      if (curUser) {
        setUser(curUser);
        const strk = await dataService.getUserStreak(curUser.id);
        setStreak(strk);
        const chk = await dataService.getTodayCheckin(curUser.id);
        setTodayCheckin(chk);
        const bdgs = dataService.getUserBadges(strk.bestStreak);
        setBadges(bdgs);
      }
    }
    loadData();
  }, []);

  if (!user || !streak) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-zinc-400 font-mono">Loading Arc Sovereign Data...</p>
      </div>
    );
  }

  const personalDay = calculatePersonalDay(user.startDate);
  const daysRemaining = getDaysRemainingInArc(personalDay);
  const nextMilestone = getNextMilestone(streak.bestStreak);
  const unlockedBadges = badges.filter((b) => b.isUnlocked);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* HEADER BAR */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-mono bg-zinc-900 border border-zinc-800 text-zinc-300 px-3 py-1 rounded-lg">
              ID: {user.publicArcId}
            </span>
            {user.anonymousUsername && (
              <span className="text-xs font-semibold text-emerald-400 font-mono">
                @{user.anonymousUsername}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            DAY {personalDay} <span className="text-zinc-500 font-normal text-xl">/ {TOTAL_ARC_DAYS}</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            WINTER ARC 2026 (Sept 15 → Dec 31) • {daysRemaining} days remaining in your journey
          </p>
        </div>

        <Link
          href="/check-in"
          className="w-full md:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center justify-center gap-2 transition-all glow-emerald"
        >
          <CheckSquare className="w-4 h-4" />
          <span>{todayCheckin ? 'VIEW / UPDATE TODAY ROLL CALL' : 'COMPLETE DAILY ROLL CALL'}</span>
        </Link>
      </div>

      {/* TODAY ROLL CALL STATUS BANNER */}
      {todayCheckin ? (
        <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-950/20">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
              TODAY ROLL CALL COMPLETED
            </div>
            <div className="text-2xl font-extrabold text-white">
              SCORE: {todayCheckin.score} / 8
            </div>
            <div className="text-xs text-zinc-300 italic">
              {todayCheckin.score === 8
                ? '"I SHOWED UP."'
                : todayCheckin.score >= 6
                ? '"I SHOWED UP. Solid adherence."'
                : '"I OWN IT. Tomorrow is another day."'}
            </div>
          </div>
          <Link
            href="/check-in"
            className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-200 transition-colors"
          >
            Edit Check-in
          </Link>
        </div>
      ) : (
        <div className="glass-card p-6 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 bg-amber-950/20">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
              ROLL CALL PENDING FOR DAY {personalDay}
            </div>
            <div className="text-lg font-bold text-white">
              Have you shown up for your 8 commitments today?
            </div>
            <p className="text-xs text-zinc-400">Takes 30-60 seconds. Honesty above all.</p>
          </div>
          <Link
            href="/check-in"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider transition-colors"
          >
            DO ROLL CALL NOW
          </Link>
        </div>
      )}

      {/* STAT GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Current Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{streak.currentStreak} <span className="text-xs font-normal text-zinc-400">days</span></div>
          <p className="text-[10px] text-zinc-500">Unbroken daily adherence</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Best Streak</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{streak.bestStreak} <span className="text-xs font-normal text-zinc-400">days</span></div>
          <p className="text-[10px] text-zinc-500">All-time record</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Consistency Rate</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{streak.consistencyPct}%</div>
          <p className="text-[10px] text-zinc-500">Overall adherence score</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Completed Days</span>
            <Calendar className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{streak.completedDays} <span className="text-xs font-normal text-zinc-400">days</span></div>
          <p className="text-[10px] text-zinc-500">Out of {personalDay} total days</p>
        </div>
      </div>

      {/* ARC PROGRESS BAR TOWARD DAY 108 */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white uppercase tracking-wider font-mono">ARC JOURNEY PROGRESS</span>
          <span className="font-mono text-emerald-400 font-bold">{Math.round((personalDay / TOTAL_ARC_DAYS) * 100)}% COMPLETE</span>
        </div>
        <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${(personalDay / TOTAL_ARC_DAYS) * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
          <span>DAY 1 (Start)</span>
          <span>DAY 54 (Midpoint)</span>
          <span>DAY 108 (Winter Arc Complete 👑)</span>
        </div>
      </div>

      {/* MILESTONES & NEXT BADGE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Next Milestone Card */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>NEXT MILESTONE</span>
            </div>
            {nextMilestone ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{nextMilestone.icon}</span>
                  <div>
                    <h4 className="font-extrabold text-white text-base">{nextMilestone.name}</h4>
                    <p className="text-xs text-zinc-400 font-mono">{nextMilestone.threshold} Days Streak Required</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed pt-2 border-t border-white/5">
                  {nextMilestone.description}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-2xl">👑</div>
                <h4 className="font-extrabold text-white">ALL MILESTONES UNLOCKED!</h4>
                <p className="text-xs text-zinc-400">You are a true Winter Arc Sovereign.</p>
              </div>
            )}
          </div>
          <Link
            href="/milestones"
            className="text-xs text-emerald-400 font-semibold flex items-center gap-1 hover:underline pt-3 border-t border-white/5"
          >
            <span>View All Milestone Badges</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Unlocked Badges Showcase */}
        <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">UNLOCKED BADGES ({unlockedBadges.length})</h3>
            <span className="text-xs text-zinc-400 font-mono">Permanently Retained</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {badges.slice(0, 4).map((badge) => (
              <div
                key={badge.id}
                className={`p-3 rounded-xl border flex flex-col items-center text-center space-y-1 ${
                  badge.isUnlocked
                    ? 'bg-zinc-900/90 border-emerald-500/40 text-white'
                    : 'bg-zinc-950/40 border-zinc-800 text-zinc-600 opacity-60'
                }`}
              >
                <span className="text-2xl">{badge.icon}</span>
                <span className="text-xs font-bold leading-tight">{badge.name}</span>
                <span className="text-[10px] font-mono text-zinc-400">{badge.threshold} Days</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
