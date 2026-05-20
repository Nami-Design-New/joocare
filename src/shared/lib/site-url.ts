function normalizeOrigin(origin: string) {
    return origin.replace(/\/$/, "");
}

function coerceToOrigin(value: string) {
    const trimmed = value.trim();

    if (/^https?:\/\//i.test(trimmed)) {
        return normalizeOrigin(trimmed);
    }

    return normalizeOrigin(`https://${trimmed.replace(/^\/+/, "")}`);
}

export function getSiteBaseUrl(): string {
    const raw =
        process.env.NEXT_PUBLIC_SITE_URL ??
        process.env.NEXT_PUBLIC_APP_URL ??
        process.env.NEXT_PUBLIC_WEB_URL ??
        process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/api\/?$/, "") ??
        "https://joocare.com";

    try {
        return coerceToOrigin(raw);
    } catch {
        return "https://joocare.com";
    }
}
