import { getBaseApiUrl } from './api-endpoints';

const STORAGE_PREFIX = 'storage/';

// Full URL of a file the API stores ("cvs/a.pdf" or "storage/cvs/a.pdf" → "https://host/storage/cvs/a.pdf").
export function resolveStorageUrl(path: string | null | undefined) {
  const trimmedPath = path?.trim().replace(/^\/+/, '');
  if (!trimmedPath) return null;
  if (/^https?:\/\//i.test(trimmedPath)) return trimmedPath;

  const relativePath = trimmedPath.startsWith(STORAGE_PREFIX)
    ? trimmedPath.slice(STORAGE_PREFIX.length)
    : trimmedPath;

  return `${new URL(getBaseApiUrl()).origin}/${STORAGE_PREFIX}${relativePath}`;
}
