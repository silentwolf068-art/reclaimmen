/**
 * Generates an anonymous, non-sequential public user identifier.
 * Example: ARC-7F29K4
 * Safe to expose in community feeds and roll call dashboards.
 */
export function generateArcId(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = 'ARC-';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
}
