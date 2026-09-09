import {
  UserProfile,
  DailyCheckin,
  UserStreak,
  CommunityStats,
  CommunityFeedItem,
  CommunityQuestion,
  QuestionResponse,
  AdminAnalytics,
  CommitmentsState
} from '@/types';
import { generateArcId } from './arcId';
import { calculatePersonalDay, getTodayIsoString, TOTAL_ARC_DAYS } from './dateUtils';
import { calculateUserStreak } from './streakEngine';
import { evaluateUserBadges } from './badgeEngine';
import { isSupabaseConfigured, supabase } from './supabaseClient';

const STORAGE_CURRENT_USER = 'reclaim_men_current_user';
const STORAGE_CHECKINS = 'reclaim_men_checkins';
const STORAGE_FEED = 'reclaim_men_feed';
const STORAGE_RESPONSES = 'reclaim_men_responses';

function getStoredUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_CURRENT_USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getStoredCheckins(userId: string): DailyCheckin[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_CHECKINS);
  if (!raw) return [];
  try {
    const all: DailyCheckin[] = JSON.parse(raw);
    return all.filter((c) => c.userId === userId);
  } catch {
    return [];
  }
}

function getStoredFeed(): CommunityFeedItem[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_FEED);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

const SAMPLE_COMMUNITY_QUESTIONS: CommunityQuestion[] = [
  {
    id: 'q-today',
    question: 'What was your biggest mental battle today, and how did you overcome it?',
    activeDate: getTodayIsoString()
  }
];

export const dataService = {
  getCurrentUser(): UserProfile | null {
    return getStoredUser();
  },

  registerUser(email: string, anonymousUsername?: string): UserProfile {
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      publicArcId: generateArcId(),
      anonymousUsername: anonymousUsername?.trim() || undefined,
      startDate: getTodayIsoString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      status: 'active',
      createdAt: new Date().toISOString()
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(newUser));
      localStorage.setItem(STORAGE_CHECKINS, JSON.stringify([])); // FRESH USER HAS ZERO PREVIOUS CHECKINS
    }

    // Async sync to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      supabase.from('profiles').insert({
        id: newUser.id,
        public_arc_id: newUser.publicArcId,
        anonymous_username: newUser.anonymousUsername,
        start_date: newUser.startDate,
        timezone: newUser.timezone,
        status: newUser.status
      }).then(({ error }) => {
        if (error) console.error('Supabase profile sync error:', error);
      });

      supabase.from('streaks').insert({
        user_id: newUser.id,
        current_streak: 0,
        best_streak: 0,
        completed_days: 0,
        consistency_pct: 0
      }).then(({ error }) => {
        if (error) console.error('Supabase streak sync error:', error);
      });
    }

    return newUser;
  },

  loginUser(): UserProfile {
    const existing = getStoredUser();
    if (existing) return existing;
    return this.registerUser('member@reclaimmen.com');
  },

  logoutUser() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_CURRENT_USER);
    }
  },

  getUserCheckins(userId: string): DailyCheckin[] {
    return getStoredCheckins(userId);
  },

  getTodayCheckin(userId: string): DailyCheckin | null {
    const today = getTodayIsoString();
    const checkins = this.getUserCheckins(userId);
    return checkins.find((c) => c.date === today) || null;
  },

  saveDailyCheckin(
    userId: string,
    commitments: CommitmentsState,
    privateReflection?: string
  ): DailyCheckin {
    const user = this.getCurrentUser();
    const today = getTodayIsoString();
    const personalDay = user ? calculatePersonalDay(user.startDate) : 1;

    // Calculate score
    const score = Object.values(commitments).filter(Boolean).length;

    let allCheckins: DailyCheckin[] = [];
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_CHECKINS);
      if (raw) {
        try { allCheckins = JSON.parse(raw); } catch { allCheckins = []; }
      }
    }

    const existingIndex = allCheckins.findIndex((c) => c.userId === userId && c.date === today);

    const checkinObj: DailyCheckin = {
      id: existingIndex >= 0 ? allCheckins[existingIndex].id : `checkin-${Date.now()}`,
      userId,
      date: today,
      personalDay,
      ...commitments,
      score,
      privateReflection,
      createdAt: existingIndex >= 0 ? allCheckins[existingIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      allCheckins[existingIndex] = checkinObj;
    } else {
      allCheckins.push(checkinObj);
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_CHECKINS, JSON.stringify(allCheckins));
    }

    // Update streak
    const userCheckins = allCheckins.filter((c) => c.userId === userId);
    const updatedStreak = calculateUserStreak(userId, userCheckins, personalDay);

    // Sync to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      supabase.from('daily_checkins').upsert({
        user_id: userId,
        date: today,
        personal_day: personalDay,
        no_porn: commitments.noPorn,
        no_masturbation: commitments.noMasturbation,
        no_doomscrolling: commitments.noDoomscrolling,
        wake_5am: commitments.wake5am,
        meditation: commitments.meditation,
        journaling: commitments.journaling,
        no_food_entertainment: commitments.noFoodEntertainment,
        movement: commitments.movement,
        score,
        private_reflection: privateReflection
      }).then(({ error }) => {
        if (error) console.error('Supabase checkin upsert error:', error);
      });

      supabase.from('streaks').upsert({
        user_id: userId,
        current_streak: updatedStreak.currentStreak,
        best_streak: updatedStreak.bestStreak,
        completed_days: updatedStreak.completedDays,
        consistency_pct: updatedStreak.consistencyPct,
        updated_at: new Date().toISOString()
      }).then(({ error }) => {
        if (error) console.error('Supabase streak upsert error:', error);
      });
    }

    return checkinObj;
  },

  getUserStreak(userId: string): UserStreak {
    const user = this.getCurrentUser();
    const checkins = this.getUserCheckins(userId);
    const personalDay = user ? calculatePersonalDay(user.startDate) : 1;
    return calculateUserStreak(userId, checkins, personalDay);
  },

  getUserBadges(bestStreak: number) {
    return evaluateUserBadges(bestStreak);
  },

  getCommunityStats(): CommunityStats {
    let allCheckins: DailyCheckin[] = [];
    let currentUser: UserProfile | null = getStoredUser();

    if (typeof window !== 'undefined') {
      const rawCheckins = localStorage.getItem(STORAGE_CHECKINS);
      if (rawCheckins) {
        try { allCheckins = JSON.parse(rawCheckins); } catch { allCheckins = []; }
      }
    }

    const today = getTodayIsoString();
    const todayCheckins = allCheckins.filter((c) => c.date === today);

    // Real dynamic calculations based on registered accounts and actual check-ins
    const totalMembers = currentUser ? 1 : 0;
    const checkedInToday = todayCheckins.length;

    const perfectCount = todayCheckins.filter((c) => c.score === 8).length;
    const highCount = todayCheckins.filter((c) => c.score === 7).length;
    const mediumCount = todayCheckins.filter((c) => c.score >= 5 && c.score <= 6).length;
    const lowCount = todayCheckins.filter((c) => c.score < 5).length;

    const totalScoreToday = todayCheckins.reduce((acc, c) => acc + c.score, 0);
    const avgScoreToday = checkedInToday > 0 ? (totalScoreToday / (checkedInToday * 8)) * 100 : 0;

    return {
      totalMembers,
      checkedInToday,
      activeStreaksTotal: checkedInToday > 0 ? 1 : 0,
      streaksByTier: {
        sevenPlus: 0,
        fourteenPlus: 0,
        twentyOnePlus: 0,
        thirtyPlus: 0,
        sixtyPlus: 0,
        ninetyPlus: 0
      },
      todayScoreDistribution: {
        perfect: perfectCount,
        high: highCount,
        medium: mediumCount,
        low: lowCount
      },
      communityAdherencePct: Math.round(avgScoreToday * 10) / 10
    };
  },

  getCommunityFeed(): CommunityFeedItem[] {
    return getStoredFeed();
  },

  addFeedItem(userId: string, reflection: string, score: number, personalDay: number): CommunityFeedItem {
    const user = this.getCurrentUser();
    const newItem: CommunityFeedItem = {
      id: `feed-${Date.now()}`,
      userId,
      publicArcId: user?.publicArcId || 'ARC-ANON',
      personalDay,
      score,
      reflection,
      fireReactions: 1,
      iceReactions: 0,
      bicepReactions: 1,
      createdAt: new Date().toISOString()
    };

    const feed = getStoredFeed();
    feed.unshift(newItem);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_FEED, JSON.stringify(feed));
    }

    if (isSupabaseConfigured && supabase) {
      supabase.from('community_feed').insert({
        user_id: userId,
        personal_day: personalDay,
        score,
        reflection,
        fire_reactions: 1,
        ice_reactions: 0,
        bicep_reactions: 1
      }).then(({ error }) => {
        if (error) console.error('Supabase feed insert error:', error);
      });
    }

    return newItem;
  },

  reactToFeedItem(feedId: string, reactionType: 'fire' | 'ice' | 'bicep') {
    const feed = getStoredFeed();
    const item = feed.find((f) => f.id === feedId);
    if (item) {
      if (reactionType === 'fire') item.fireReactions++;
      if (reactionType === 'ice') item.iceReactions++;
      if (reactionType === 'bicep') item.bicepReactions++;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_FEED, JSON.stringify(feed));
      }
    }
  },

  getTodayQuestion(): CommunityQuestion {
    return SAMPLE_COMMUNITY_QUESTIONS[0];
  },

  getQuestionResponses(): QuestionResponse[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_RESPONSES);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  addQuestionResponse(questionId: string, text: string): QuestionResponse {
    const user = this.getCurrentUser();
    const newResp: QuestionResponse = {
      id: `resp-${Date.now()}`,
      userId: user?.id || 'anon',
      publicArcId: user?.publicArcId || 'ARC-ANON',
      anonymousUsername: user?.anonymousUsername,
      questionId,
      response: text,
      createdAt: new Date().toISOString()
    };
    const current = this.getQuestionResponses();
    current.unshift(newResp);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_RESPONSES, JSON.stringify(current));
    }
    return newResp;
  },

  getAdminAnalytics(): AdminAnalytics {
    let allCheckins: DailyCheckin[] = [];
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_CHECKINS);
      if (raw) {
        try { allCheckins = JSON.parse(raw); } catch { allCheckins = []; }
      }
    }

    const currentUser = getStoredUser();
    const totalMembers = currentUser ? 1 : 0;
    const checkedInToday = allCheckins.filter((c) => c.date === getTodayIsoString()).length;
    const avgScore = allCheckins.length > 0
      ? allCheckins.reduce((acc, c) => acc + c.score, 0) / allCheckins.length
      : 0;

    return {
      totalMembers,
      newMembersToday: totalMembers,
      newMembersThisWeek: totalMembers,
      activeMembers: totalMembers,
      dailyCheckinRate: totalMembers > 0 ? (checkedInToday / totalMembers) * 100 : 0,
      averageScore: Math.round(avgScore * 10) / 10,
      ruleMissRates: {
        wake5am: 0,
        noDoomscrolling: 0,
        meditation: 0,
        noFoodEntertainment: 0,
        noPorn: 0,
        noMasturbation: 0,
        journaling: 0,
        movement: 0
      },
      retentionRates: {
        day1: 100,
        day3: 0,
        day7: 0,
        day14: 0,
        day21: 0,
        day30: 0,
        day60: 0,
        day92: 0
      }
    };
  },

  deleteUserAccount(userId: string) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_CURRENT_USER);
      localStorage.removeItem(STORAGE_CHECKINS);
    }
    if (isSupabaseConfigured && supabase) {
      supabase.from('profiles').delete().eq('id', userId).then(({ error }) => {
        if (error) console.error('Supabase profile delete error:', error);
      });
    }
  }
};
