import { MilestoneBadge } from '@/types';

export const MASTER_BADGES: MilestoneBadge[] = [
  {
    id: 'day_1',
    name: 'STARTED',
    icon: '🧊',
    threshold: 1,
    description: 'Began the 92-day Winter Arc journey.'
  },
  {
    id: 'day_3',
    name: 'SPARK',
    icon: '🔥',
    threshold: 3,
    description: 'Built momentum for 3 consecutive days.'
  },
  {
    id: 'day_7',
    name: 'FIRST SHIELD',
    icon: '🛡️',
    threshold: 7,
    description: 'Completed 7 days of unbreakable discipline.'
  },
  {
    id: 'day_14',
    name: 'DISCIPLINE BUILDER',
    icon: '⚔️',
    threshold: 14,
    description: 'Two full weeks of intentional focus.'
  },
  {
    id: 'day_21',
    name: 'MINDSET SHIFT',
    icon: '🧠',
    threshold: 21,
    description: '21 days — new neural pathways forming.'
  },
  {
    id: 'day_30',
    name: 'IRON MONTH',
    icon: '🏆',
    threshold: 30,
    description: 'Conquered a full month of discipline.'
  },
  {
    id: 'day_45',
    name: 'UNSHAKEN',
    icon: '🔥',
    threshold: 45,
    description: 'Halfway through the 92-day Arc.'
  },
  {
    id: 'day_60',
    name: 'IRON MIND',
    icon: '🗿',
    threshold: 60,
    description: '60 days of mastering attention and habits.'
  },
  {
    id: 'day_75',
    name: 'ELITE STREAK',
    icon: '⚡',
    threshold: 75,
    description: '75 days of elite adherence.'
  },
  {
    id: 'day_92',
    name: 'WINTER ARC COMPLETE',
    icon: '👑',
    threshold: 92,
    description: 'Conquered the entire 92-Day Winter Arc!'
  }
];

export function evaluateUserBadges(bestStreak: number, unlockedBadgeIds: string[] = []): MilestoneBadge[] {
  return MASTER_BADGES.map((badge) => {
    const isUnlocked = bestStreak >= badge.threshold || unlockedBadgeIds.includes(badge.id);
    return {
      ...badge,
      isUnlocked
    };
  });
}

export function getNextMilestone(bestStreak: number): MilestoneBadge | null {
  const sorted = [...MASTER_BADGES].sort((a, b) => a.threshold - b.threshold);
  return sorted.find((b) => b.threshold > bestStreak) || null;
}
