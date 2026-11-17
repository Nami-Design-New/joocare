import type { PaginationMeta } from '../types/assessment.types';

function readNumber(value: unknown, fallback: number) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function readNextPage(nextPageUrl: unknown) {
  if (typeof nextPageUrl !== 'string' || !nextPageUrl) return null;
  const page = Number(new URL(nextPageUrl).searchParams.get('page'));
  return Number.isInteger(page) && page > 0 ? page : null;
}

// Reads the Laravel paginator fields that sit next to `data` in list responses.
export function readPaginationMeta(
  body: unknown,
  fallbackPerPage: number,
): PaginationMeta {
  if (!body || typeof body !== 'object') {
    return { total: 0, perPage: fallbackPerPage, nextPage: null };
  }
  const record = body as Record<string, unknown>;
  return {
    total: readNumber(record.total, 0),
    perPage: readNumber(record.per_page, fallbackPerPage),
    nextPage: readNextPage(record.next_page_url),
  };
}

export function buildListParams(
  page: number,
  limitPerPage: number,
  extra: Record<string, string | undefined> = {},
) {
  const params = new URLSearchParams({
    pagination: 'on',
    limit_per_page: String(limitPerPage),
    page: String(page),
  });
  Object.entries(extra).forEach(([key, value]) => {
    if (value?.trim()) params.set(key, value.trim());
  });
  return params.toString();
}
