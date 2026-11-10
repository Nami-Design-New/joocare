import { ASSESSMENT_LINK_VALIDITY_HOURS } from '../constants';

const HOUR_MS = 60 * 60 * 1000;

// "20 Sep 2026, 10:15 AM" (English) / localized date + time for other locales.
export function formatAssessmentDateTime(value: string | Date, locale: string) {
  const date = new Date(value);
  if (locale !== 'en') {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  }

  const parts = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? '';

  return `${part('day')} ${part('month')} ${part('year')}, ${part('hour')}:${part('minute')} ${part('dayPeriod')}`;
}

// When a link emailed at `sentAt` stops working.
export function getAssessmentLinkExpiry(sentAt: Date) {
  return new Date(sentAt.getTime() + ASSESSMENT_LINK_VALIDITY_HOURS * HOUR_MS);
}

// Countdown as HH:MM:SS (hours can go past 24, e.g. "70:12:05").
export function formatCountdown(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;
  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');
}

export function splitDuration(totalSeconds: number) {
  return {
    minutes: Math.floor(totalSeconds / 60),
    seconds: totalSeconds % 60,
  };
}
