'use client';

import React, { useEffect, useState } from 'react';
import { Award, Lock, Sparkles, ShieldCheck } from 'lucide-react';
import { dataService } from '@/lib/dataService';
import { MilestoneBadge, UserStreak } from '@/types';

export default function MilestonesPage() {
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [badges, setBadges] = useState<MilestoneBadge[]>([]);

  useEffect(() => {
    async function loadMilestones() {
      const curUser = dataService.getCurrentUser();
      if (curUser) {
        const strk = await dataService.getUserStreak(curUser.id);
        setStreak(strk);
        setBadges(dataService.getUserBadges(strk.bestStreak));
      }
    }
    loadMilestones();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <Award className="w-3.5 h-3.5" />
          <span>PERMANENT RECOGNITION SYSTEM</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">WINTER ARC MILESTONE BADGES</h1>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Badges cannot be manually claimed or purchased. They are awarded automatically based on your best unbroken streak.
        </p>
      </div>

      {streak && (
        <div className="glass-panel p-4 rounded-xl border border-white/10 flex items-center justify-between text-xs font-mono max-w-xl mx-auto">
          <span className="text-zinc-400">YOUR ALL-TIME BEST STREAK:</span>
          <span className="text-amber-400 font-extrabold text-base">{streak.bestStreak} DAYS</span>
        </div>
      )}

      {/* BADGES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`glass-panel p-5 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${
              badge.isUnlocked
                ? 'border-emerald-500/40 bg-emerald-950/20 text-white glow-emerald'
                : 'border-zinc-800 bg-zinc-950/40 text-zinc-500 opacity-60'
            }`}
          >
            <div className="space-y-2 text-center">
              <div className="text-4xl my-2">{badge.icon}</div>
              <div className="font-extrabold text-sm tracking-wide">{badge.name}</div>
              <div className="text-[11px] font-mono text-amber-400 font-semibold">{badge.threshold} DAYS STREAK</div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{badge.description}</p>
            </div>

            <div className="pt-3 border-t border-white/5 text-center text-[10px] font-mono">
              {badge.isUnlocked ? (
                <span className="text-emerald-400 font-bold flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  UNLOCKED & RETAINED
                </span>
              ) : (
                <span className="text-zinc-500 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" />
                  LOCKED
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
