import { PROFILE_VIEWERS_PAGE_SIZE } from '../constants';
import { PROFILE_VIEWERS_PREVIEW } from '../constants/profile-insights-preview-data';
import type {
  ProfileInsightsQuery,
  ProfileViewersPage,
} from '../types/profile-insights.types';

// Company-name search + paging over the preview viewers (until the API does this server-side).
export function getProfileViewers({
  search,
  page,
}: ProfileInsightsQuery): ProfileViewersPage {
  const term = search.trim().toLowerCase();
  const matches = term
    ? PROFILE_VIEWERS_PREVIEW.filter((viewer) =>
        viewer.companyName.toLowerCase().includes(term),
      )
    : PROFILE_VIEWERS_PREVIEW;
  const lastPage = Math.max(
    1,
    Math.ceil(matches.length / PROFILE_VIEWERS_PAGE_SIZE),
  );
  const currentPage = Math.min(Math.max(1, page), lastPage);
  const start = (currentPage - 1) * PROFILE_VIEWERS_PAGE_SIZE;

  return {
    viewers: matches.slice(start, start + PROFILE_VIEWERS_PAGE_SIZE),
    total: matches.length,
    page: currentPage,
    pageSize: PROFILE_VIEWERS_PAGE_SIZE,
  };
}

// "Monday, 25 December 2025" in English, the localized long date otherwise.
export function formatViewedDate(value: string, locale: string) {
  const date = new Date(value);
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
