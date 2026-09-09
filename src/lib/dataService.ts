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
import { calculatePersonalDay, getTodayIsoString } from './dateUtils';
import { calculateUserStreak } from './streakEngine';
import { evaluateUserBadges } from './badgeEngine';

// LOCAL STORAGE KEYS FOR DUAL DATA ENGINE
const STORAGE_CURRENT_USER = 'reclaim_men_current_user';
const STORAGE_CHECKINS = 'reclaim_men_checkins';
const STORAGE_FEED = 'reclaim_men_feed';
const STORAGE_RESPONSES = 'reclaim_men_responses';

// PRE-SEEDED TEST DATA
const INITIAL_DEMO_USER: UserProfile = {
  id: 'demo-user-123',
  publicArcId: 'ARC-7F29K4',
  anonymousUsername: 'IronMind',
  startDate: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Started 16 days ago
  timezone: 'America/New_York',
  status: 'active',
  createdAt: new Date().toISOString()
};

function getStoredUser(): UserProfile | null {
  if (typeof window === 'undefined') return INITIAL_DEMO_USER;
  const raw = localStorage.getItem(STORAGE_CURRENT_USER);
  if (!raw) {
    localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(INITIAL_DEMO_USER));
    return INITIAL_DEMO_USER;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_USER;
  }
}

function getStoredCheckins(): DailyCheckin[] {
  if (typeof window === 'undefined') return generateInitialDemoCheckins(INITIAL_DEMO_USER);
  const raw = localStorage.getItem(STORAGE_CHECKINS);
  if (!raw) {
    const seed = generateInitialDemoCheckins(INITIAL_DEMO_USER);
    localStorage.setItem(STORAGE_CHECKINS, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function generateInitialDemoCheckins(user: UserProfile): DailyCheckin[] {
  const checkins: DailyCheckin[] = [];
  const startDate = new Date(user.startDate);

  // Generate 16 consecutive days of checkins for demo user
  for (let i = 0; i < 16; i++) {
    const curDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = curDate.toISOString().split('T')[0];
    const score = i === 12 ? 5 : 8; // Failed 1 day at day 13 (score 5/8)

    checkins.push({
      id: `checkin-${i + 1}`,
      userId: user.id,
      date: dateStr,
      personalDay: i + 1,
      noPorn: true,
      noMasturbation: true,
      noDoomscrolling: score === 8,
      wake5am: score === 8,
      meditation: true,
      journaling: true,
      noFoodEntertainment: score === 8,
      movement: true,
      score: score,
      privateReflection: `Reflection for day ${i + 1}: Focused on deep work and eliminated distractions.`,
      createdAt: curDate.toISOString(),
      updatedAt: curDate.toISOString()
    });
  }

  return checkins;
}

function getStoredFeed(): CommunityFeedItem[] {
  if (typeof window === 'undefined') return INITIAL_DEMO_FEED;
  const raw = localStorage.getItem(STORAGE_FEED);
  if (!raw) {
    localStorage.setItem(STORAGE_FEED, JSON.stringify(INITIAL_DEMO_FEED));
    return INITIAL_DEMO_FEED;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_FEED;
  }
}

const INITIAL_DEMO_FEED: CommunityFeedItem[] = [
  {
    id: 'feed-1',
    userId: 'user-7291',
    publicArcId: 'ARC-7291',
    personalDay: 17,
    score: 8,
    reflection: 'Almost broke my streak tonight. Went for a 5km night walk instead. Discipline over impulse.',
    fireReactions: 42,
    iceReactions: 19,
    bicepReactions: 31,
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString()
  },
  {
    id: 'feed-2',
    userId: 'user-8102',
    publicArcId: 'ARC-8102',
    personalDay: 30,
    score: 8,
    reflection: 'Day 30 complete! Iron Month badge unlocked. Clean sleep, zero porn, 5 AM wakeups feel natural now.',
    fireReactions: 89,
    iceReactions: 45,
    bicepReactions: 67,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'feed-3',
    userId: 'user-4491',
    publicArcId: 'ARC-4491',
    personalDay: 7,
    score: 7,
    reflection: 'Missed 5 AM wake up, but completed all other 7 commitments. I own it. Tomorrow we go 8/8.',
    fireReactions: 24,
    iceReactions: 12,
    bicepReactions: 18,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  }
];

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
      localStorage.setItem(STORAGE_CHECKINS, JSON.stringify([]));
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
    const all = getStoredCheckins();
    return all.filter((c) => c.userId === userId);
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

    const allCheckins = getStoredCheckins();
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
    return {
      totalMembers: 12481,
      checkedInToday: 6842,
      activeStreaksTotal: 3104,
      streaksByTier: {
        sevenPlus: 5824,
        fourteenPlus: 3102,
        twentyOnePlus: 1487,
        thirtyPlus: 642,
        sixtyPlus: 91,
        ninetyPlus: 14
      },
      todayScoreDistribution: {
        perfect: 3482,
        high: 1621,
        medium: 1203,
        low: 536
      },
      communityAdherencePct: 87.4
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
    return {
      totalMembers: 12481,
      newMembersToday: 142,
      newMembersThisWeek: 890,
      activeMembers: 9420,
      dailyCheckinRate: 74.8,
      averageScore: 7.2,
      ruleMissRates: {
        wake5am: 42,
        noDoomscrolling: 38,
        meditation: 21,
        noFoodEntertainment: 18,
        noPorn: 14,
        noMasturbation: 12,
        journaling: 11,
        movement: 9
      },
      retentionRates: {
        day1: 94.2,
        day3: 86.5,
        day7: 78.1,
        day14: 69.4,
        day21: 61.2,
        day30: 54.8,
        day60: 42.1,
        day92: 38.6
      }
    };
  },

  deleteUserAccount(userId: string) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_CURRENT_USER);
      const allCheckins = getStoredCheckins().filter((c) => c.userId !== userId);
      localStorage.setItem(STORAGE_CHECKINS, JSON.stringify(allCheckins));
    }
  }
};
