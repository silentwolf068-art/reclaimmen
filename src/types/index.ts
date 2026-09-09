export interface UserProfile {
  id: string;
  publicArcId: string;
  anonymousUsername?: string;
  startDate: string; // ISO YYYY-MM-DD
  timezone: string;
  status: 'active' | 'suspended' | 'deleted';
  createdAt: string;
}

export interface CommitmentsState {
  noPorn: boolean;
  noMasturbation: boolean;
  noDoomscrolling: boolean;
  wake5am: boolean;
  meditation: boolean;
  journaling: boolean;
  noFoodEntertainment: boolean;
  movement: boolean;
}

export interface DailyCheckin extends CommitmentsState {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  personalDay: number; // 1 to 92
  score: number; // 0 to 8
  privateReflection?: string; // Private to user
  createdAt: string;
  updatedAt: string;
}

export interface UserStreak {
  userId: string;
  currentStreak: number;
  bestStreak: number;
  completedDays: number;
  consistencyPct: number;
  updatedAt: string;
}

export interface MilestoneBadge {
  id: string;
  name: string;
  icon: string;
  threshold: number; // streak day count required
  description: string;
  awardedAt?: string;
  isUnlocked?: boolean;
}

export interface CommunityQuestion {
  id: string;
  question: string;
  activeDate: string;
}

export interface QuestionResponse {
  id: string;
  userId: string;
  publicArcId: string;
  anonymousUsername?: string;
  questionId: string;
  response: string;
  createdAt: string;
}

export interface CommunityFeedItem {
  id: string;
  userId: string;
  publicArcId: string;
  personalDay: number;
  score: number;
  reflection: string;
  fireReactions: number;
  iceReactions: number;
  bicepReactions: number;
  createdAt: string;
}

export interface CommunityStats {
  totalMembers: number;
  checkedInToday: number;
  activeStreaksTotal: number;
  streaksByTier: {
    sevenPlus: number;
    fourteenPlus: number;
    twentyOnePlus: number;
    thirtyPlus: number;
    sixtyPlus: number;
    ninetyPlus: number;
  };
  todayScoreDistribution: {
    perfect: number; // 8/8
    high: number; // 7/8
    medium: number; // 5-6/8
    low: number; // <5/8
  };
  communityAdherencePct: number;
}

export interface AdminAnalytics {
  totalMembers: number;
  newMembersToday: number;
  newMembersThisWeek: number;
  activeMembers: number;
  dailyCheckinRate: number;
  averageScore: number;
  ruleMissRates: {
    noPorn: number;
    noMasturbation: number;
    noDoomscrolling: number;
    wake5am: number;
    meditation: number;
    journaling: number;
    noFoodEntertainment: number;
    movement: number;
  };
  retentionRates: {
    day1: number;
    day3: number;
    day7: number;
    day14: number;
    day21: number;
    day30: number;
    day60: number;
    day92: number;
  };
}
