/**
 * Date and Personal Day utilities for Winter Arc & Rolling 92-Day Journeys
 */

export function getTodayIsoString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculatePersonalDay(startDateStr: string, targetDateStr?: string): number {
  const start = new Date(startDateStr);
  start.setHours(0, 0, 0, 0);

  const target = targetDateStr ? new Date(targetDateStr) : new Date();
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Day 1 on start date, capped at Day 92 max
  const personalDay = diffDays + 1;
  return Math.min(92, Math.max(1, personalDay));
}

export function formatFriendlyDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function getDaysRemainingInArc(personalDay: number): number {
  return Math.max(0, 92 - personalDay);
}
