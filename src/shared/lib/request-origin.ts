import "server-only";

import { headers } from "next/headers";

function normalizeOrigin(origin: string) {
  return origin.replace(/\/$/, "");
}

export async function getRequestOrigin() {
  const fallback =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_WEB_URL ??
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/api\/?$/, "") ??
    "https://joocare.com";

  try {
    const headerList = await headers();
    const host =
      headerList.get("x-forwarded-host") ??
      headerList.get("host") ??
      new URL(fallback).host;
    const proto =
      headerList.get("x-forwarded-proto") ??
      new URL(fallback).protocol.replace(":", "");

    if (!host) return normalizeOrigin(fallback);
    return normalizeOrigin(`${proto}://${host}`);
  } catch {
    return normalizeOrigin(fallback);
  }
}

export function toAbsoluteUrl(inputUrl: string, origin: string) {
  if (!inputUrl) return origin;

  const trimmed = inputUrl.trim();

  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const normalizedOrigin = normalizeOrigin(origin);

  if (trimmed.startsWith("//")) {
    const protocol = new URL(normalizedOrigin).protocol;
    return `${protocol}${trimmed}`;
  }

  if (trimmed.startsWith("/")) return `${normalizedOrigin}${trimmed}`;

  return `${normalizedOrigin}/${trimmed}`;
}
