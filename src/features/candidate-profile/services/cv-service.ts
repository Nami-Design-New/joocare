import { getUserApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";

function normalizeStoredCvPath(cvPath: string) {
  const trimmedPath = cvPath.trim();

  if (!trimmedPath) {
    return "";
  }

  const imagesIndex = trimmedPath.indexOf("images/");

  if (imagesIndex >= 0) {
    return trimmedPath.slice(imagesIndex);
  }

  return trimmedPath;
}

export async function uploadCv({
  cvPath,
  locale = "en",
  token,
}: {
  cvPath: string;
  locale?: string;
  token: string;
}) {
  const formData = new FormData();
  formData.append("cv", normalizeStoredCvPath(cvPath));

  const { ok, data, message } = await apiFetch(`${getUserApiUrl()}/auth/update-cv`, {
    method: "POST",
    locale,
    token,
    body: formData,
  });

  if (!ok) {
    throw new Error(message || "Failed to upload CV.");
  }

  return {
    data,
    message: data?.message ?? message ?? "CV uploaded successfully.",
  };
}

export async function removeCv({
  locale = "en",
  token,
}: {
  locale?: string;
  token: string;
}) {
  const { ok, data, message } = await apiFetch(`${getUserApiUrl()}/auth/delete-cv`, {
    method: "DELETE",
    locale,
    token,
    body: new FormData(),
  });

  if (!ok) {
    throw new Error(message || "Failed to delete CV.");
  }

  return {
    data,
    message: data?.message ?? message ?? "CV deleted successfully.",
  };
}
