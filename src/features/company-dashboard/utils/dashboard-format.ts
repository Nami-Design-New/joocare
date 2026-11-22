import type { DashboardPage } from '../index.type';

export function currentDashboardMonth() {
  const today = new Date();
  return (
    today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0')
  );
}

export function formatDashboardNumber(
  value: number,
  locale: string,
  compact = false,
) {
  return new Intl.NumberFormat(locale, {
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(value);
}

/** Formats a percent value (e.g. -4.55) with its sign: "+100%", "-4.6%". */
export function formatGrowthRate(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    signDisplay: 'exceptZero',
    maximumFractionDigits: 1,
  }).format(value / 100);
}

function readNumber(value: unknown, fallback: number) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

// Reads the Laravel paginator fields that sit next to `data` in list responses.
export function readDashboardPage<T>(
  body: unknown,
  fallbackPage: number,
  fallbackPerPage: number,
): DashboardPage<T> {
  if (!body || typeof body !== 'object' || !('data' in body))
    throw new Error('Invalid list response.');
  const record = body as Record<string, unknown>;
  if (!Array.isArray(record.data)) throw new Error('Invalid list response.');
  return {
    data: record.data as T[],
    currentPage: readNumber(record.current_page, fallbackPage),
    perPage: readNumber(record.per_page, fallbackPerPage),
    total: readNumber(record.total, record.data.length),
  };
}
