'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Flame,
  Award,
  CheckCircle2,
  Lock,
  MessageSquare,
  HelpCircle,
  TrendingUp,
  Shield
} from 'lucide-react';
import { dataService } from '@/lib/dataService';
import { CommunityStats, CommunityFeedItem, QuestionResponse } from '@/types';

export default function CommunityPage() {
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [feed, setFeed] = useState<CommunityFeedItem[]>([]);
  const [responses, setResponses] = useState<QuestionResponse[]>([]);

  useEffect(() => {
    async function loadData() {
      const s = await dataService.getCommunityStats();
      const f = await dataService.getCommunityFeed();
      const r = dataService.getQuestionResponses();
      setStats(s);
      setFeed(f);
      setResponses(r);
    }
    loadData();
  }, []);

  const handleReaction = async (feedId: string, type: 'fire' | 'ice' | 'bicep') => {
    await dataService.reactToFeedItem(feedId, type);
    const f = await dataService.getCommunityFeed();
    setFeed(f);
  };

  if (!stats) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-zinc-400 font-mono">Connecting to Realtime Community Feed...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* COMMUNITY HEADER */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <Users className="w-3.5 h-3.5" />
          <span>RECLAIM MEN — LIVE ROLL CALL</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">THE COMMUNITY ROLL CALL</h1>
        <p className="text-xs text-zinc-400 max-w-lg mx-auto">
          Real-time aggregated discipline statistics across all active ARC members worldwide.
        </p>
      </div>

      {/* AGGREGATED STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
          <div className="text-xs text-zinc-400 uppercase tracking-wider font-mono">TOTAL MEMBERS</div>
          <div className="text-3xl font-extrabold text-white font-mono">{stats.totalMembers.toLocaleString()}</div>
          <div className="text-[10px] text-zinc-500">Active Sovereigns</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
          <div className="text-xs text-emerald-400 uppercase tracking-wider font-mono">CHECKED IN TODAY</div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">{stats.checkedInToday.toLocaleString()}</div>
          <div className="text-[10px] text-zinc-500">Roll call submitted</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
          <div className="text-xs text-amber-400 uppercase tracking-wider font-mono">ACTIVE STREAKS</div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">{stats.activeStreaksTotal.toLocaleString()}</div>
          <div className="text-[10px] text-zinc-500">Unbroken records</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
          <div className="text-xs text-indigo-400 uppercase tracking-wider font-mono">ADHERENCE RATE</div>
          <div className="text-3xl font-extrabold text-indigo-400 font-mono">{stats.communityAdherencePct}%</div>
          <div className="text-[10px] text-zinc-500">Average daily score</div>
        </div>
      </div>

      {/* TODAY'S SCORE DISTRIBUTION & STREAKS BREAKDOWN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Score Breakdown */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            TONIGHT'S SCORE BREAKDOWN
          </h3>
          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between mb-1 text-zinc-300">
                <span>8 / 8 (Perfect)</span>
                <span className="font-bold text-emerald-400">{stats.todayScoreDistribution.perfect.toLocaleString()} Members</span>
              </div>
              <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: '51%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 text-zinc-300">
                <span>7 / 8 (High Adherence)</span>
                <span className="font-bold text-teal-400">{stats.todayScoreDistribution.high.toLocaleString()} Members</span>
              </div>
              <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500" style={{ width: '24%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 text-zinc-300">
                <span>5 – 6 / 8 (Moderate)</span>
                <span className="font-bold text-amber-400">{stats.todayScoreDistribution.medium.toLocaleString()} Members</span>
              </div>
              <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: '18%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 text-zinc-300">
                <span>Below 5 / 8 (Owned It)</span>
                <span className="font-bold text-zinc-400">{stats.todayScoreDistribution.low.toLocaleString()} Members</span>
              </div>
              <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-zinc-700" style={{ width: '7%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Active Streak Tiers */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider font-mono flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            ACTIVE COMMUNITY STREAK TIERS
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="text-zinc-400">7+ Days</div>
              <div className="text-xl font-bold text-white mt-1">{stats.streaksByTier.sevenPlus.toLocaleString()}</div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="text-zinc-400">14+ Days</div>
              <div className="text-xl font-bold text-white mt-1">{stats.streaksByTier.fourteenPlus.toLocaleString()}</div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="text-zinc-400">21+ Days</div>
              <div className="text-xl font-bold text-white mt-1">{stats.streaksByTier.twentyOnePlus.toLocaleString()}</div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="text-zinc-400">30+ Days</div>
              <div className="text-xl font-bold text-amber-400 mt-1">{stats.streaksByTier.thirtyPlus.toLocaleString()}</div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="text-zinc-400">60+ Days</div>
              <div className="text-xl font-bold text-amber-400 mt-1">{stats.streaksByTier.sixtyPlus.toLocaleString()}</div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="text-zinc-400">90+ Days</div>
              <div className="text-xl font-bold text-emerald-400 mt-1">{stats.streaksByTier.ninetyPlus.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ANONYMOUS COMMUNITY FEED */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            ANONYMOUS COMMUNITY FEED
          </h2>
          <span className="text-xs font-mono text-zinc-500">No Followers • Pure Accountability</span>
        </div>

        <div className="space-y-4">
          {feed.map((item) => (
            <div key={item.id} className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {item.publicArcId}
                  </span>
                  <span className="text-zinc-400">DAY {item.personalDay}</span>
                </div>
                <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {item.score}/8 SCORE
                </span>
              </div>

              <p className="text-sm text-zinc-200 leading-relaxed font-normal">
                "{item.reflection}"
              </p>

              {/* REACTION BUTTONS */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <button
                  onClick={() => handleReaction(item.id, 'fire')}
                  className="px-3 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 flex items-center gap-1.5 transition-colors"
                >
                  <span>🔥</span>
                  <span>{item.fireReactions}</span>
                </button>
                <button
                  onClick={() => handleReaction(item.id, 'ice')}
                  className="px-3 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 flex items-center gap-1.5 transition-colors"
                >
                  <span>🧊</span>
                  <span>{item.iceReactions}</span>
                </button>
                <button
                  onClick={() => handleReaction(item.id, 'bicep')}
                  className="px-3 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 flex items-center gap-1.5 transition-colors"
                >
                  <span>💪</span>
                  <span>{item.bicepReactions}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
