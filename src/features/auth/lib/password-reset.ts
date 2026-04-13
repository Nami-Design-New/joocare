import { getAuthApiUrl, type AuthApiRole } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";

export type PasswordResetRole = AuthApiRole;

function createFormData(values: Record<string, string>) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(values)) {
    formData.append(key, value);
  }

  return formData;
}

export async function requestPasswordReset({
  role,
  email,
  locale,
}: {
  role: PasswordResetRole;
  email: string;
  locale: string;
}) {
  const { ok, message } = await apiFetch(`${getAuthApiUrl(role)}/auth/forgot-password`, {
    method: "POST",
    locale,
    body: createFormData({ email }),
  });

  if (!ok) {
    throw new Error(message || "Failed to send reset code.");
  }

  return message || "Reset code sent successfully.";
}

export async function verifyPasswordResetOtp({
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
  const { ok, message } = await apiFetch(`${getAuthApiUrl(role)}/auth/verify-otp`, {
    method: "POST",
    locale,
    body: createFormData({ email, otp }),
  });

  if (!ok) {
    throw new Error(message || "Invalid verification code.");
  }

  return message || "Code verified successfully.";
}

export async function resetPassword({
  role,
  email,
  otp,
  password,
  passwordConfirmation,
  locale,
}: {
  role: PasswordResetRole;
  email: string;
  otp: string;
  password: string;
  passwordConfirmation: string;
  locale: string;
}) {
  const { ok, message } = await apiFetch(`${getAuthApiUrl(role)}/auth/reset-password`, {
    method: "POST",
    locale,
    body: createFormData({
      email,
      otp,
      password,
      password_confirmation: passwordConfirmation,
    }),
  });

  if (!ok) {
    throw new Error(message || "Failed to reset password.");
  }

  return message || "Password reset successfully.";
}
