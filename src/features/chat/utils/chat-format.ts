export function formatChatDate(value: string, locale: string) {
  const date = new Date(value);
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
  const parts = dateFormatter.formatToParts(date);
  const day = ['day', 'month', 'year']
    .map((type) => parts.find((part) => part.type === type)?.value)
    .join(' ');
  const time = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  }).format(date);
  return `${day} · ${time}`;
}

export function formatChatFileSize(bytes: number, locale: string) {
  const megabytes = bytes / (1024 * 1024);
  const size = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
  }).format(megabytes);
  return `${size} MB`;
}
