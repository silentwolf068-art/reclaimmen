import {
  UserProfile,
  DailyCheckin,
  UserStreak,
  CommunityStats,
  CommunityFeedItem,
  CommunityQuestion,
  QuestionResponse,
  ChatMessage,
  AdminAnalytics,
  CommitmentsState
} from '@/types';
import { generateArcId } from './arcId';
import { calculatePersonalDay, getTodayIsoString, TOTAL_ARC_DAYS } from './dateUtils';
import { calculateUserStreak } from './streakEngine';
import { evaluateUserBadges } from './badgeEngine';
import { isSupabaseConfigured, supabase } from './supabaseClient';

const STORAGE_CURRENT_USER = 'reclaim_men_current_user';

function getSessionUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_CURRENT_USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setSessionUser(user: UserProfile | null) {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_CURRENT_USER);
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
    return getSessionUser();
  },

  async registerUser(email: string, anonymousUsername?: string): Promise<UserProfile> {
    const today = getTodayIsoString();
    const cleanEmail = email.trim().toLowerCase();

    // Check if profile exists in Supabase
    if (isSupabaseConfigured && supabase) {
      const { data: existing } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', cleanEmail)
        .single();

      if (existing) {
        const userObj: UserProfile = {
          id: existing.id,
          publicArcId: existing.public_arc_id,
          anonymousUsername: existing.anonymous_username || undefined,
          startDate: existing.start_date || today,
          timezone: existing.timezone || 'UTC',
          status: existing.status || 'active',
          createdAt: existing.created_at || new Date().toISOString()
        };
        setSessionUser(userObj);
        return userObj;
      }
    }

    // Create fresh profile
    const newProfile: UserProfile = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      publicArcId: generateArcId(),
      anonymousUsername: anonymousUsername?.trim() || undefined,
      startDate: today,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      status: 'active',
      createdAt: new Date().toISOString()
    };

    setSessionUser(newProfile);

    // Save to Supabase
    if (isSupabaseConfigured && supabase) {
      await supabase.from('profiles').insert({
        id: newProfile.id,
        email: cleanEmail,
        public_arc_id: newProfile.publicArcId,
        anonymous_username: newProfile.anonymousUsername,
        start_date: newProfile.startDate,
        timezone: newProfile.timezone,
        status: newProfile.status
      });

      await supabase.from('streaks').insert({
        user_id: newProfile.id,
        current_streak: 0,
        best_streak: 0,
        completed_days: 0,
        consistency_pct: 0
      });
    }

    return newProfile;
  },

  async loginUser(email: string): Promise<UserProfile> {
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured && supabase) {
      const { data: existing } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', cleanEmail)
        .single();

      if (existing) {
        const userObj: UserProfile = {
          id: existing.id,
          publicArcId: existing.public_arc_id,
          anonymousUsername: existing.anonymous_username || undefined,
          startDate: existing.start_date || getTodayIsoString(),
          timezone: existing.timezone || 'UTC',
          status: existing.status || 'active',
          createdAt: existing.created_at || new Date().toISOString()
        };
        setSessionUser(userObj);
        return userObj;
      }
    }

    return this.registerUser(cleanEmail);
  },

  logoutUser() {
    setSessionUser(null);
  },

  async getUserCheckins(userId: string): Promise<DailyCheckin[]> {
    if (!isSupabaseConfigured || !supabase) return [];

    const { data, error } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true });

    if (error || !data) return [];

    return data.map((c: any) => ({
      id: c.id,
      userId: c.user_id,
      date: c.date,
      personalDay: c.personal_day,
      noPorn: Boolean(c.no_porn),
      noMasturbation: Boolean(c.no_masturbation),
      noDoomscrolling: Boolean(c.no_doomscrolling),
      wake5am: Boolean(c.wake_5am),
      meditation: Boolean(c.meditation),
      journaling: Boolean(c.journaling),
      noFoodEntertainment: Boolean(c.no_food_entertainment),
      movement: Boolean(c.movement),
      coldShower: Boolean(c.cold_shower),
      read10Pages: Boolean(c.read_10_pages),
      noAlcohol: Boolean(c.no_alcohol),
      customRuleName: c.custom_rule_name,
      customRuleDone: Boolean(c.custom_rule_done),
      score: c.score || 0,
      totalActiveRules: c.total_active_rules || 8,
      privateReflection: c.private_reflection,
      createdAt: c.created_at,
      updatedAt: c.updated_at
    }));
  },

  async getTodayCheckin(userId: string): Promise<DailyCheckin | null> {
    const today = getTodayIsoString();
    const checkins = await this.getUserCheckins(userId);
    return checkins.find((c) => c.date === today) || null;
  },

  async saveDailyCheckin(
    userId: string,
    commitments: CommitmentsState,
    privateReflection?: string
  ): Promise<DailyCheckin> {
    const user = this.getCurrentUser();
    const today = getTodayIsoString();
    const personalDay = user ? calculatePersonalDay(user.startDate) : 1;

    const baseRules = [
      commitments.noPorn,
      commitments.noMasturbation,
      commitments.noDoomscrolling,
      commitments.wake5am,
      commitments.meditation,
      commitments.journaling,
      commitments.noFoodEntertainment,
      commitments.movement
    ];

    let totalActive = 8;
    if (commitments.coldShower !== undefined) totalActive++;
    if (commitments.read10Pages !== undefined) totalActive++;
    if (commitments.noAlcohol !== undefined) totalActive++;
    if (commitments.customRuleName) totalActive++;

    let passedCount = baseRules.filter(Boolean).length;
    if (commitments.coldShower) passedCount++;
    if (commitments.read10Pages) passedCount++;
    if (commitments.noAlcohol) passedCount++;
    if (commitments.customRuleDone) passedCount++;

    const checkinObj: DailyCheckin = {
      id: `checkin-${Date.now()}`,
      userId,
      date: today,
      personalDay,
      ...commitments,
      score: passedCount,
      totalActiveRules: totalActive,
      privateReflection,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      await supabase.from('daily_checkins').upsert({
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
        cold_shower: commitments.coldShower || false,
        read_10_pages: commitments.read10Pages || false,
        no_alcohol: commitments.noAlcohol || false,
        custom_rule_name: commitments.customRuleName,
        custom_rule_done: commitments.customRuleDone || false,
        score: passedCount,
        total_active_rules: totalActive,
        private_reflection: privateReflection
      });

      // Re-calculate streak from DB
      const userCheckins = await this.getUserCheckins(userId);
      const updatedStreak = calculateUserStreak(userId, userCheckins, personalDay);

      await supabase.from('streaks').upsert({
        user_id: userId,
        current_streak: updatedStreak.currentStreak,
        best_streak: updatedStreak.bestStreak,
        completed_days: updatedStreak.completedDays,
        consistency_pct: updatedStreak.consistencyPct,
        updated_at: new Date().toISOString()
      });
    }

    return checkinObj;
  },

  async getUserStreak(userId: string): Promise<UserStreak> {
    const user = this.getCurrentUser();
    const personalDay = user ? calculatePersonalDay(user.startDate) : 1;

    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data) {
        return {
          userId: data.user_id,
          currentStreak: data.current_streak || 0,
          bestStreak: data.best_streak || 0,
          completedDays: data.completed_days || 0,
          consistencyPct: Number(data.consistency_pct) || 0,
          updatedAt: data.updated_at || new Date().toISOString()
        };
      }
    }

    const checkins = await this.getUserCheckins(userId);
    return calculateUserStreak(userId, checkins, personalDay);
  },

  getUserBadges(bestStreak: number) {
    return evaluateUserBadges(bestStreak);
  },

  async getChatMessages(channel: 'general' | 'urges' | 'morning5am' | 'books'): Promise<ChatMessage[]> {
    if (!isSupabaseConfigured || !supabase) return [];

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('channel', channel)
      .order('created_at', { ascending: true })
      .limit(100);

    if (error || !data) return [];

    return data.map((m: any) => ({
      id: m.id,
      userId: m.user_id,
      publicArcId: m.public_arc_id,
      anonymousUsername: m.anonymous_username,
      channel: m.channel,
      message: m.message,
      reactions: {
        fire: m.fire_reactions || 0,
        bicep: m.bicep_reactions || 0,
        shield: m.shield_reactions || 0
      },
      createdAt: m.created_at
    }));
  },

  async addChatMessage(userId: string, channel: 'general' | 'urges' | 'morning5am' | 'books', text: string): Promise<ChatMessage> {
    const user = this.getCurrentUser();
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      userId,
      publicArcId: user?.publicArcId || 'ARC-ANON',
      anonymousUsername: user?.anonymousUsername,
      channel,
      message: text,
      reactions: { fire: 0, bicep: 0, shield: 0 },
      createdAt: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      await supabase.from('chat_messages').insert({
        user_id: userId,
        public_arc_id: newMsg.publicArcId,
        anonymous_username: newMsg.anonymousUsername,
        channel,
        message: text,
        fire_reactions: 0,
        bicep_reactions: 0,
        shield_reactions: 0
      });
    }

    return newMsg;
  },

  async reactToChatMessage(messageId: string, type: 'fire' | 'bicep' | 'shield') {
    if (!isSupabaseConfigured || !supabase) return;

    const column = type === 'fire' ? 'fire_reactions' : type === 'bicep' ? 'bicep_reactions' : 'shield_reactions';
    const { data } = await supabase.from('chat_messages').select(column).eq('id', messageId).single();
    if (data) {
      const currentVal = (data as any)[column] || 0;
      await supabase.from('chat_messages').update({ [column]: currentVal + 1 }).eq('id', messageId);
    }
  },

  async getCommunityStats(): Promise<CommunityStats> {
    const today = getTodayIsoString();

    if (isSupabaseConfigured && supabase) {
      const { count: totalMembers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: checkedInToday } = await supabase.from('daily_checkins').select('user_id', { count: 'exact', head: true }).eq('date', today);
      const { count: activeStreaksTotal } = await supabase.from('streaks').select('*', { count: 'exact', head: true }).gt('current_streak', 0);

      const { data: todayCheckins } = await supabase.from('daily_checkins').select('score, total_active_rules').eq('date', today);

      let perfect = 0, high = 0, medium = 0, low = 0, totalScore = 0;
      if (todayCheckins && todayCheckins.length > 0) {
        todayCheckins.forEach((c: any) => {
          const maxRules = c.total_active_rules || 8;
          totalScore += c.score;
          if (c.score >= maxRules) perfect++;
          else if (c.score >= 7) high++;
          else if (c.score >= 5) medium++;
          else low++;
        });
      }

      const totalPossible = (todayCheckins?.length || 0) * 8;
      const avgAdherence = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0;

      return {
        totalMembers: totalMembers || 0,
        checkedInToday: checkedInToday || 0,
        activeStreaksTotal: activeStreaksTotal || 0,
        streaksByTier: {
          sevenPlus: 0,
          fourteenPlus: 0,
          twentyOnePlus: 0,
          thirtyPlus: 0,
          sixtyPlus: 0,
          ninetyPlus: 0
        },
        todayScoreDistribution: {
          perfect,
          high,
          medium,
          low
        },
        communityAdherencePct: Math.round(avgAdherence * 10) / 10
      };
    }

    return {
      totalMembers: 0,
      checkedInToday: 0,
      activeStreaksTotal: 0,
      streaksByTier: { sevenPlus: 0, fourteenPlus: 0, twentyOnePlus: 0, thirtyPlus: 0, sixtyPlus: 0, ninetyPlus: 0 },
      todayScoreDistribution: { perfect: 0, high: 0, medium: 0, low: 0 },
      communityAdherencePct: 0
    };
  },

  async getCommunityFeed(): Promise<CommunityFeedItem[]> {
    if (!isSupabaseConfigured || !supabase) return [];

    const { data } = await supabase
      .from('community_feed')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30);

    if (!data) return [];

    return data.map((f: any) => ({
      id: f.id,
      userId: f.user_id,
      publicArcId: f.public_arc_id,
      personalDay: f.personal_day,
      score: f.score,
      reflection: f.reflection,
      fireReactions: f.fire_reactions || 0,
      iceReactions: f.ice_reactions || 0,
      bicepReactions: f.bicep_reactions || 0,
      createdAt: f.created_at
    }));
  },

  async reactToFeedItem(feedId: string, type: 'fire' | 'ice' | 'bicep') {
    if (!isSupabaseConfigured || !supabase) return;
    const column = type === 'fire' ? 'fire_reactions' : type === 'ice' ? 'ice_reactions' : 'bicep_reactions';
    const { data } = await supabase.from('community_feed').select(column).eq('id', feedId).single();
    if (data) {
      const currentVal = (data as any)[column] || 0;
      await supabase.from('community_feed').update({ [column]: currentVal + 1 }).eq('id', feedId);
    }
  },

  async addFeedItem(userId: string, reflection: string, score: number, personalDay: number): Promise<CommunityFeedItem> {
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

    if (isSupabaseConfigured && supabase) {
      await supabase.from('community_feed').insert({
        user_id: userId,
        public_arc_id: newItem.publicArcId,
        personal_day: personalDay,
        score,
        reflection,
        fire_reactions: 1,
        ice_reactions: 0,
        bicep_reactions: 1
      });
    }

    return newItem;
  },

  getTodayQuestion(): CommunityQuestion {
    return SAMPLE_COMMUNITY_QUESTIONS[0];
  },

  getQuestionResponses(): QuestionResponse[] {
    return [];
  },

  addQuestionResponse(questionId: string, text: string): QuestionResponse {
    const user = this.getCurrentUser();
    return {
      id: `resp-${Date.now()}`,
      userId: user?.id || 'anon',
      publicArcId: user?.publicArcId || 'ARC-ANON',
      anonymousUsername: user?.anonymousUsername,
      questionId,
      response: text,
      createdAt: new Date().toISOString()
    };
  },

  async getAdminAnalytics(): Promise<AdminAnalytics> {
    if (isSupabaseConfigured && supabase) {
      const { count: totalMembers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: checkedInToday } = await supabase.from('daily_checkins').select('user_id', { count: 'exact', head: true }).eq('date', getTodayIsoString());

      const { data: allCheckins } = await supabase.from('daily_checkins').select('score');
      const avgScore = allCheckins && allCheckins.length > 0
        ? allCheckins.reduce((acc: number, c: any) => acc + (c.score || 0), 0) / allCheckins.length
        : 0;

      const membersCount = totalMembers || 0;

      return {
        totalMembers: membersCount,
        newMembersToday: membersCount,
        newMembersThisWeek: membersCount,
        activeMembers: membersCount,
        dailyCheckinRate: membersCount > 0 ? ((checkedInToday || 0) / membersCount) * 100 : 0,
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
    }

    return {
      totalMembers: 0,
      newMembersToday: 0,
      newMembersThisWeek: 0,
      activeMembers: 0,
      dailyCheckinRate: 0,
      averageScore: 0,
      ruleMissRates: { wake5am: 0, noDoomscrolling: 0, meditation: 0, noFoodEntertainment: 0, noPorn: 0, noMasturbation: 0, journaling: 0, movement: 0 },
      retentionRates: { day1: 0, day3: 0, day7: 0, day14: 0, day21: 0, day30: 0, day60: 0, day92: 0 }
    };
  },

  async deleteUserAccount(userId: string) {
    setSessionUser(null);
    if (isSupabaseConfigured && supabase) {
      await supabase.from('profiles').delete().eq('id', userId);
    }
  }
};
