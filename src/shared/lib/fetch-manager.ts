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
};

function getHeaderValue(headers: Headers, names: string[]) {
  for (const name of names) {
    const value = headers.get(name);

    if (value) {
      return value;
    }
  }

  return null;
}

function resolveStatusCode(response: Response) {
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

export async function apiFetch<T = Record<string, unknown>>(
  url: string,
  options: ApiFetchOptions = {},
): Promise<ApiResult<T>> {
  const {
    method = "GET",
    locale = "en",
    token,
    headers,
    body,
    cache = "no-store",
  } = options;

  const requestHeaders = new Headers(headers);

  if (!requestHeaders.has("Accept")) {
    requestHeaders.set("Accept", "application/json");
  }

  if (!requestHeaders.has("Accept-Language")) {
    requestHeaders.set("Accept-Language", locale);
  }

  if (token && !requestHeaders.has("Authorization")) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body,
    cache,
  });



  // console.log("Jobs data:::" , data);
  const data =
    ((await response.json().catch(() => null)) as ApiFetchResponse<T> | null) ?? null;

  const statusCode = resolveStatusCode(response);
  const ok = statusCode >= 200 && statusCode < 300;
  const message = resolveMessage(response, data);

  return {
    response,
    data,
    statusCode,
    ok,
    message,
  };
}
