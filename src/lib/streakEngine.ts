import { DailyCheckin, UserStreak } from '@/types';

/**
 * Calculates current streak, best streak, completed days, and consistency rate.
 * Relapse Philosophy:
 * - A missed day resets current_streak to 0.
 * - Progress, historical badges, and best_streak are NEVER erased.
 */
export function calculateUserStreak(
  userId: string,
  checkins: DailyCheckin[],
  personalDay: number
): UserStreak {
  if (!checkins || checkins.length === 0) {
    return {
      userId,
      currentStreak: 0,
      bestStreak: 0,
      completedDays: 0,
      consistencyPct: 0,
      updatedAt: new Date().toISOString()
    };
  }

  // Sort checkins by date ascending
  const sorted = [...checkins].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // A checkin is considered "successful/completed" if score >= 6 out of 8
  const isPassing = (c: DailyCheckin) => c.score >= 6;

  let currentStreak = 0;
  let bestStreak = 0;
  let runningStreak = 0;
  let completedDaysCount = 0;

  let lastDate: Date | null = null;

  for (const c of sorted) {
    const checkinDate = new Date(c.date);
    checkinDate.setHours(0, 0, 0, 0);

    if (isPassing(c)) {
      completedDaysCount++;
      if (!lastDate) {
        runningStreak = 1;
      } else {
        const diffDays = Math.round((checkinDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          runningStreak++;
        } else if (diffDays > 1) {
          // Missed one or more days in between -> reset running streak
          runningStreak = 1;
        }
      }
      if (runningStreak > bestStreak) {
        bestStreak = runningStreak;
      }
      lastDate = checkinDate;
    } else {
      // Failed checkin -> reset running streak
      runningStreak = 0;
      lastDate = checkinDate;
    }
  }

  // Check if today or yesterday was the last passing checkin to determine current active streak
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (lastDate) {
    const daysSinceLastCheckin = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceLastCheckin <= 1) {
      currentStreak = runningStreak;
    } else {
      currentStreak = 0; // Missed recent days
    }
  } else {
    currentStreak = 0;
  }

  const consistencyPct = personalDay > 0
    ? Math.min(100, Math.round((completedDaysCount / personalDay) * 100))
    : 0;

  return {
    userId,
    currentStreak,
    bestStreak,
    completedDays: completedDaysCount,
    consistencyPct,
    updatedAt: new Date().toISOString()
  };
}
