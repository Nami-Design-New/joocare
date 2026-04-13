import { getUserApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";

export async function updateCandidateBio({
  bio,
  locale = "en",
  token,
}: {
  bio: string;
  locale?: string;
  token: string;
}) {
  const formData = new FormData();
  formData.append("bio", bio);

  const { ok, data, message } = await apiFetch(`${getUserApiUrl()}/user-bio`, {
    method: "POST",
    locale,
    token,
    body: formData,
  });

  if (!ok) {
    throw new Error(message || "Failed to update about information.");
  }

  return data;
}
