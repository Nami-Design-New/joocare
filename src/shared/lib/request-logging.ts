const SENSITIVE_QUERY_KEYS = new Set([
  "token",
  "access_token",
  "refresh_token",
  "authorization",
  "password",
  "secret",
  "code",
]);

type RouteCounterKey = "proxy" | "apiFetch";

type RouteCounterStore = Record<RouteCounterKey, Map<string, number>>;

const routeCounters = globalThis as typeof globalThis & {
  __joocareRouteCounters__?: RouteCounterStore;
};

function getRouteCounters(): RouteCounterStore {
  if (!routeCounters.__joocareRouteCounters__) {
    routeCounters.__joocareRouteCounters__ = {
      proxy: new Map<string, number>(),
      apiFetch: new Map<string, number>(),
    };
  }

  return routeCounters.__joocareRouteCounters__;
}

function isLoggingEnabled(envValue: string | undefined, fallback = false) {
  if (envValue == null) {
    return fallback;
  }

  const normalized = envValue.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}

function redactQueryValue(key: string, value: string) {
  return SENSITIVE_QUERY_KEYS.has(key.toLowerCase()) ? "[redacted]" : value;
}

export function shouldLogRequests() {
  return isLoggingEnabled(
    process.env.ENABLE_REQUEST_LOGS,
    process.env.NODE_ENV !== "production",
  );
}

export function shouldLogOnly429() {
  return isLoggingEnabled(process.env.LOG_ONLY_429, false);
}

export function sanitizeUrl(input: string) {
  try {
    const url = new URL(input);
    const params = new URLSearchParams(url.search);

    for (const [key, value] of params.entries()) {
      params.set(key, redactQueryValue(key, value));
    }

    const search = params.toString();
    return `${url.origin}${url.pathname}${search ? `?${search}` : ""}`;
  } catch {
    return input;
  }
}

export function getRoutePath(input: string) {
  try {
    return new URL(input).pathname;
  } catch {
    return input;
  }
}

export function incrementRouteCounter(source: RouteCounterKey, url: string) {
  const counters = getRouteCounters();
  const routePath = getRoutePath(url);
  const currentCount = counters[source].get(routePath) ?? 0;
  const nextCount = currentCount + 1;

  counters[source].set(routePath, nextCount);

  return {
    routePath,
    routeCount: nextCount,
  };
}

export function createRequestLogContext(input: {
  requestId: string;
  source: "proxy" | "apiFetch";
  method: string;
  url: string;
  status?: number;
  durationMs?: number;
  details?: Record<string, unknown>;
}) {
  return {
    ts: new Date().toISOString(),
    requestId: input.requestId,
    source: input.source,
    method: input.method,
    url: sanitizeUrl(input.url),
    status: input.status,
    durationMs: input.durationMs,
    ...input.details,
  };
}
