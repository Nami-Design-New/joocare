export type AuthApiRole = "candidate" | "employer";

function getRequiredEnvVar(value: string | undefined, errorMessage: string) {
  if (!value) {
    throw new Error(errorMessage);
  }

  return value;
}

export function getBaseApiUrl() {
  return getRequiredEnvVar(
    process.env.NEXT_PUBLIC_BASE_URL,
    "API endpoint is not configured.",
  );
}

export function getUserApiUrl() {
  return getRequiredEnvVar(
    process.env.NEXT_PUBLIC_BASE_USER_URL,
    "User API endpoint is not configured.",
  );
}

export function getCompanyApiUrl() {
  return getRequiredEnvVar(
    process.env.NEXT_PUBLIC_BASE_COMPANY_URL,
    "Company API endpoint is not configured.",
  );
}

export function getAuthApiUrl(role: AuthApiRole) {
  return role === "candidate" ? getUserApiUrl() : getCompanyApiUrl();
}
