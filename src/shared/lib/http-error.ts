type HttpStatusMeta = {
  title: string;
  description: string;
};

const HTTP_STATUS_PREFIX = /^\[HTTP_(\d{3})\]\s*/;

export class HttpStatusError extends Error {
  statusCode: number;

  constructor(statusCode: number, message?: string) {
    const resolvedMessage = message?.trim() || getDefaultHttpErrorMessage(statusCode);
    super(`[HTTP_${statusCode}] ${resolvedMessage}`);
    this.name = "HttpStatusError";
    this.statusCode = statusCode;
  }
}

export function createHttpStatusError(statusCode: number, message?: string) {
  return new HttpStatusError(statusCode, message);
}

export function getHttpStatusCode(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof error.statusCode === "number"
  ) {
    return error.statusCode;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    const match = error.message.match(HTTP_STATUS_PREFIX);

    if (match) {
      return Number.parseInt(match[1], 10);
    }
  }

  return undefined;
}

export function getHttpErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message.replace(HTTP_STATUS_PREFIX, "").trim();
  }

  return null;
}

export function getHttpStatusMeta(
  statusCode: number,
  fallbackMessage?: string | null,
): HttpStatusMeta {
  switch (statusCode) {
    case 401:
      return {
        title: "Sign in required",
        description:
          fallbackMessage?.trim() ||
          "Please sign in to continue and view this content.",
      };
    case 403:
      return {
        title: "Access denied",
        description:
          fallbackMessage?.trim() ||
          "You do not have permission to access this page.",
      };
    case 404:
      return {
        title: "Page not found",
        description:
          fallbackMessage?.trim() ||
          "The content you are looking for is no longer available.",
      };
    case 422:
      return {
        title: "Unable to process request",
        description:
          fallbackMessage?.trim() ||
          "Some of the request data is invalid. Please review it and try again.",
      };
    case 429:
      return {
        title: "Too many requests",
        description:
          fallbackMessage?.trim() ||
          "There have been too many requests in a short time. Please try again soon.",
      };
    case 503:
      return {
        title: "Service unavailable",
        description:
          fallbackMessage?.trim() ||
          "The service is temporarily unavailable. Please try again in a moment.",
      };
    default:
      return {
        title: statusCode >= 500 ? "Something went wrong" : "Request failed",
        description:
          fallbackMessage?.trim() ||
          getDefaultHttpErrorMessage(statusCode),
      };
  }
}

function getDefaultHttpErrorMessage(statusCode: number) {
  if (statusCode === 404) {
    return "The requested resource could not be found.";
  }

  if (statusCode === 401) {
    return "Authentication is required to complete this request.";
  }

  if (statusCode === 403) {
    return "You do not have permission to complete this request.";
  }

  if (statusCode >= 500) {
    return "An unexpected server error occurred.";
  }

  return "The request could not be completed.";
}
