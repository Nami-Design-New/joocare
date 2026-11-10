export function dashboardNumber(value: number | string | undefined) {
  if (value === undefined || value === null || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function formatDashboardDate(
  value: string,
  locale: string,
  short = false,
) {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : locale, {
    day: 'numeric',
    month: short ? 'short' : 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));
}

export function formatDashboardNumber(
  value: number | string | undefined,
  locale: string,
  compact = false,
) {
  const number = dashboardNumber(value);
  if (number === null) return '—';
  return new Intl.NumberFormat(locale, {
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(number);
}

export function previousDashboardPeriod(
  value: string,
  locale: string,
  includeYear = true,
) {
  const date = new Date(value + '-01T00:00:00Z');
  date.setUTCMonth(date.getUTCMonth() - 1);
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    ...(includeYear ? { year: 'numeric' } : {}),
    timeZone: 'UTC',
  }).format(date);
}
