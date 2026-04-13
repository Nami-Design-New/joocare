import { getAuthApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";
import { PasswordResetRole } from "./password-reset";

function createFormData(values: Record<string, string>) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(values)) {
    formData.append(key, value);
  }

  return formData;
}

export async function requestEmailVerification({
  role,
  email,
  locale,
}: {
  role: PasswordResetRole;
  email: string;
  locale: string;
}) {
  const { ok, message } = await apiFetch(`${getAuthApiUrl(role)}/auth/email/verify`, {
    method: "POST",
    locale,
    body: createFormData({ email }),
  });

  if (!ok) {
    throw new Error(message || "Failed to send verification code.");
  }

  return message || "Verification code sent successfully.";
}

export async function confirmEmailVerification({
  role,
  email,
  otp,
  locale,
}: {
  role: PasswordResetRole;
  email: string;
  otp: string;
  locale: string;
}) {
  const { ok, message, data } = await apiFetch(`${getAuthApiUrl(role)}/auth/email/confirm`, {
    method: "POST",
    locale,
    body: createFormData({ email, otp }),
  });

  if (!ok) {
    throw new Error(message || "Failed to confirm verification code.");
  }

  return {
    message: message || "Email verified successfully.",
    data,
  };
}
