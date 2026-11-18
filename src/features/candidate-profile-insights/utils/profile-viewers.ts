import type { ProfileInsightsQuery } from '../types/profile-insights.types';

// "Monday, 25 December 2025" in English, the localized long date otherwise.
export function formatViewedDate(value: string, locale: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  if (locale !== 'en') {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'full',
      timeZone: 'UTC',
    }).format(date);
  }
  const parts = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? '';
  return `${part('weekday')}, ${part('day')} ${part('month')} ${part('year')}`;
}

// `/candidate/profile-insights?search=…&page=…` (empty values left out).
export function buildProfileInsightsQuery({
  search,
  page,
}: ProfileInsightsQuery) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (page > 1) params.set('page', String(page));
  const query = params.toString();
  return query ? `?${query}` : '';
}
