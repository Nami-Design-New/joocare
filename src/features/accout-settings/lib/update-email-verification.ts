import { getCompanyApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";

export async function verifyUpdatedEmail({
  email,
  otp,
  token,
}: {
  email: string;
  otp: string;
  token: string;
}) {
  const { ok, message, data } = await apiFetch(
    `${getCompanyApiUrl()}/auth/verify-update-email`,
    {
      method: "POST",
      token,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    },
  );

  if (!ok) {
    throw new Error(message || "Failed to verify updated email.");
  }

  return {
    message: message || "Email verified successfully.",
    data,
  };
}
