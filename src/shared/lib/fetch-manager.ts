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

  const data =
    ((await response.json().catch(() => null)) as ApiFetchResponse<T> | null) ?? null;
 
  // console.log("from Fetch Api", data);
  const statusCode =
    response.status === 401 ? 401 : (data?.code ?? response.status);
  const ok = statusCode >= 200 && statusCode < 300;

  return {
    response,
    data,
    statusCode,
    ok,
    message: data?.message ?? null,
  };
}
