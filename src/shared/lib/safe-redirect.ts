const PLACEHOLDER_ORIGIN = 'http://local.invalid';

/**
 * Returns `value` only when it is a path inside this site (e.g. `/en/jobs?page=2`).
 * Full URLs (`https://other.com`), protocol-relative URLs (`//other.com`),
 * backslash or whitespace tricks (`/\other.com`, `/\t/other.com`) and anything
 * else fall back to `fallback`, so a `callbackUrl` in the query string can't
 * send the user to another site (open redirect).
 */
export function getSafeRedirectPath(
  value: string | null | undefined,
  fallback: string,
): string {
  if (!value || !value.startsWith('/')) return fallback;

  try {
    // Resolve the value the same way the browser would, then make sure it
    // stayed on the same origin.
    const url = new URL(value, PLACEHOLDER_ORIGIN);
    if (url.origin !== PLACEHOLDER_ORIGIN) return fallback;

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
