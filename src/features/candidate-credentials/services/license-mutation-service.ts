import { getUserApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";

type LicenseMutationPayload = {
  title: string;
  number: string;
  countryId: string;
  image?: string | null;
  locale?: string;
  token: string;
};

function buildLicenseFormData(
  payload: LicenseMutationPayload,
  includeMethodOverride = false,
) {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("number", payload.number);
  formData.append("country_id", payload.countryId);

  if (payload.image) {
    formData.append("image", payload.image);
  }

  if (includeMethodOverride) {
    formData.append("_method", "put");
  }

  return formData;
}

export async function createLicense(payload: LicenseMutationPayload) {
  const { ok, data, message } = await apiFetch(`${getUserApiUrl()}/user-licenses`, {
    method: "POST",
    locale: payload.locale,
    token: payload.token,
    body: buildLicenseFormData(payload),
  });

  if (!ok) {
    throw new Error(message || "Failed to add license.");
  }

  return data;
}

export async function updateLicense(id: string, payload: LicenseMutationPayload) {
  const { ok, data, message } = await apiFetch(`${getUserApiUrl()}/user-licenses/${id}`, {
    method: "POST",
    locale: payload.locale,
    token: payload.token,
    body: buildLicenseFormData(payload, true),
  });

  if (!ok) {
    throw new Error(message || "Failed to update license.");
  }

  return data;
}

export async function deleteLicense({
  id,
  locale = "en",
  token,
}: {
  id: string;
  locale?: string;
  token: string;
}) {
  const { ok, data, message } = await apiFetch(`${getUserApiUrl()}/user-licenses/${id}`, {
    method: "DELETE",
    locale,
    token,
    body: new FormData(),
  });

  if (!ok) {
    throw new Error(message || "Failed to delete license.");
  }

  return data;
}
