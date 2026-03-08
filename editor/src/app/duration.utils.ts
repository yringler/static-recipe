/**
 * Converts human-friendly duration strings to ISO 8601.
 * Accepts: "30m", "1h", "1h30m", "1h 30m", "90", "1:30"
 * Returns: "PT30M", "PT1H", "PT1H30M", etc.
 */
export function toISO8601(input: string): string {
  if (!input || !input.trim()) return 'PT0M';
  const s = input.trim();

  // Already ISO 8601
  if (/^P/i.test(s)) return s.toUpperCase();

  // HH:MM format
  const colonMatch = s.match(/^(\d+):(\d+)$/);
  if (colonMatch) {
    const h = parseInt(colonMatch[1], 10);
    const m = parseInt(colonMatch[2], 10);
    return buildISO(h, m);
  }

  // "1h30m", "30m", "2h", "1h 30m", etc.
  const h = s.match(/(\d+)\s*h/i);
  const m = s.match(/(\d+)\s*m/i);
  const allDigits = s.match(/^\d+$/);

  if (h || m) {
    return buildISO(h ? parseInt(h[1], 10) : 0, m ? parseInt(m[1], 10) : 0);
  }

  // Plain number → treat as minutes
  if (allDigits) {
    return buildISO(0, parseInt(s, 10));
  }

  return 'PT0M';
}

function buildISO(hours: number, minutes: number): string {
  if (hours === 0 && minutes === 0) return 'PT0M';
  let result = 'PT';
  if (hours > 0) result += `${hours}H`;
  if (minutes > 0) result += `${minutes}M`;
  return result;
}

/**
 * Converts ISO 8601 duration to human-friendly display string.
 */
export function fromISO8601(iso: string): string {
  if (!iso) return '';
  const match = iso.match(/P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/);
  if (!match) return iso;
  const [, , hours, minutes] = match;
  const parts: string[] = [];
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  return parts.join(' ') || '0m';
}
