// Applied date as in the design, e.g. "21 December 2026, 4:00 AM".
export function formatApplicationDate(
  value: string | undefined,
  locale: string,
) {
  if (!value || Number.isNaN(Date.parse(value))) return value ?? '';
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(value));
}
