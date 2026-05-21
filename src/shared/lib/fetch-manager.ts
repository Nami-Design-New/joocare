import {
  createRequestLogContext,
  incrementRouteCounter,
  shouldLogOnly429,
  shouldLogRequests,
} from "@/shared/lib/request-logging";

type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiFetchResponse<T = Record<string, unknown>> = {
  code?: number;
  message?: string;
  data?: T;
  token?: string;
  access_token?: string;
};

export type ApiResult<T = Record<string, unknown>> = {
  response: Response;
  data: ApiFetchResponse<T> | null;
  statusCode: number;
  ok: boolean;
  message: string | null;
};
type ApiFetchOptions = {
  method?: ApiMethod;
  locale?: string;
  token?: string;
  headers?: HeadersInit;
  body?: BodyInit | null;
  cache?: RequestCache;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
  skipUnauthorizedHandler?: boolean;
};

export const UNAUTHORIZED_EVENT = "app:unauthorized";

function normalizeLocale(locale: string | null | undefined) {
  if (!locale) return null;
  const value = locale.trim();
  if (!value) return null;

  const primary = value.split(",")[0]?.trim() ?? "";
  if (!primary) return null;

  const lower = primary.toLowerCase();
  if (lower.startsWith("ar")) return "ar";
  if (lower.startsWith("en")) return "en";

  return primary;
}

function resolveDefaultLocale() {
  if (typeof document !== "undefined") {
    const fromDom = normalizeLocale(document.documentElement?.lang);
    if (fromDom) return fromDom;
  }

  if (typeof navigator !== "undefined") {
    const fromNavigator = normalizeLocale(navigator.language);
    if (fromNavigator) return fromNavigator;
  }

  return "en";
}

function getHeaderValue(headers: Headers, names: string[]) {
  for (const name of names) {
    const value = headers.get(name);

    if (value) {
      return value;
    }
  }

  return null;
}

// function resolveStatusCode(response: Response) {
//   const headerStatusCode = getHeaderValue(response.headers, [
//     "x-status-code",
//     "status-code",
//     "code",
//   ]);
//   const parsedHeaderStatusCode = headerStatusCode
//     ? Number.parseInt(headerStatusCode, 10)
//     : Number.NaN;

//   if (!Number.isNaN(parsedHeaderStatusCode) && parsedHeaderStatusCode > 0) {
//     return parsedHeaderStatusCode;
//   }

//   return response.status;
// }
function resolveStatusCode<T>(
  response: Response,
  data: ApiFetchResponse<T> | null,
) {
  // 1. code from body
  if (typeof data?.code === "number" && data.code > 0) {
    return data.code;
  }

  // 2. code from headers
  const headerStatusCode = getHeaderValue(response.headers, [
    "x-status-code",
    "status-code",
    "code",
  ]);

  const parsedHeaderStatusCode = headerStatusCode
    ? Number.parseInt(headerStatusCode, 10)
    : Number.NaN;

  if (!Number.isNaN(parsedHeaderStatusCode) && parsedHeaderStatusCode > 0) {
    return parsedHeaderStatusCode;
  }

  // 3. fallback to response.status
  return response.status;
}

function resolveMessage<T>(
  response: Response,
  data: ApiFetchResponse<T> | null,
) {
  return (
    getHeaderValue(response.headers, [
      "x-message",
      "message",
      "x-error-message",
      "x-status-message",
      "status-message",
    ]) ??
    data?.message ??
    null
  );
}
export function getTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function logApiFetch(input: {
  requestId: string;
  method: string;
  url: string;
  statusCode: number;
  startedAt: number;
  locale: string;
  hasToken: boolean;
  message: string | null;
}) {
  const { routeCount, routePath } = incrementRouteCounter("apiFetch", input.url);

  if (!shouldLogRequests()) {
    return;
  }

  if (shouldLogOnly429() && input.statusCode !== 429) {
    return;
  }

  console.log(
    "[apiFetch]",
    JSON.stringify(
      createRequestLogContext({
        requestId: input.requestId,
        source: "apiFetch",
        method: input.method,
        url: input.url,
        status: input.statusCode,
        durationMs: Date.now() - input.startedAt,
        details: {
          routePath,
          routeCount,
          locale: input.locale,
          hasToken: input.hasToken,
          message: input.message,
        },
      }),
    ),
  );
}

export async function apiFetch<T = Record<string, unknown>>(
  url: string,
  options: ApiFetchOptions = {},
): Promise<ApiResult<T>> {
  const {
    method = "GET",
    locale,
    token,
    headers,
    body,
    cache = "no-store",
    next,
    skipUnauthorizedHandler = false,
  } = options;
  const startedAt = Date.now();
  const requestId = crypto.randomUUID();

  const resolvedLocale = normalizeLocale(locale) ?? resolveDefaultLocale();
  const requestHeaders = new Headers(headers);

  requestHeaders.set('X-Timezone', getTimeZone());
  if (!requestHeaders.has("Accept")) {
    requestHeaders.set("Accept", "application/json");
  }

  if (!requestHeaders.has("Accept-Language")) {
    requestHeaders.set("Accept-Language", resolvedLocale);
  }

  if (token && !requestHeaders.has("Authorization")) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body,
    cache,
    next,
  });



  // console.log("Jobs data:::", response);
  const data =
    ((await response.json().catch(() => null)) as ApiFetchResponse<T> | null) ?? null;

  const statusCode = resolveStatusCode(response, data);

  const ok = statusCode >= 200 && statusCode < 300;
  const message = resolveMessage(response, data);

  logApiFetch({
    requestId,
    method,
    url,
    statusCode,
    startedAt,
    locale: resolvedLocale,
    hasToken: Boolean(token),
    message,
  });

  if (
    statusCode === 401 &&
    token &&
    !skipUnauthorizedHandler &&
    typeof window !== "undefined"
  ) {
    window.dispatchEvent(
      new CustomEvent(UNAUTHORIZED_EVENT, {
        detail: {
          message,
          statusCode,
        },
      }),
    );
  }

  return {
    response,
    data,
    statusCode,
    ok,
    message,
  };
}
