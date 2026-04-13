import { getBaseApiUrl, getUserApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";

type CountryOption = {
  id: string;
  label: string;
};

function normalizeCountryOptions(payload: unknown): CountryOption[] {
  if (!payload || typeof payload !== "object") {
    return [];
  }

  const data = (payload as { data?: unknown }).data;
  const items = Array.isArray(data)
    ? data
    : data && typeof data === "object" && Array.isArray((data as { data?: unknown[] }).data)
      ? (data as { data: unknown[] }).data
      : [];

  return items
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;
      const id = record.id;
      const label = record.title ?? record.name;

      if ((typeof id === "number" || typeof id === "string") && typeof label === "string") {
        return {
          id: String(id),
          label,
        };
      }

      return null;
    })
    .filter((item): item is CountryOption => Boolean(item));
}

export async function getCountryOptions(locale = "en") {
  const { ok, data, message } = await apiFetch(`${getBaseApiUrl()}/countries?pagination=off`, {
    method: "GET",
    locale,
  });

  if (!ok) {
    throw new Error(message || "Failed to load countries.");
  }

  return normalizeCountryOptions(data);
}

type EducationPayload = {
  degree: string;
  university: string;
  startDate: string;
  endDate?: string;
  countryId: string;
  locale?: string;
  token: string;
};

function buildEducationFormData(payload: EducationPayload, includeMethodOverride = false) {
  const formData = new FormData();
  formData.append("degree", payload.degree);
  formData.append("university", payload.university);
  formData.append("start_date", payload.startDate);
  if (payload.endDate) {
    formData.append("end_date", payload.endDate);
  }
  formData.append("country_id", payload.countryId);

  if (includeMethodOverride) {
    formData.append("_method", "put");
  }

  return formData;
}

export async function createEducation(payload: EducationPayload) {
  const { ok, data, message } = await apiFetch(`${getUserApiUrl()}/user-educations`, {
    method: "POST",
    locale: payload.locale,
    token: payload.token,
    body: buildEducationFormData(payload),
  });

  if (!ok) {
    throw new Error(message || "Failed to add education.");
  }

  return data;
}

export async function updateEducation(id: string, payload: EducationPayload) {
  const { ok, data, message } = await apiFetch(`${getUserApiUrl()}/user-educations/${id}`, {
    method: "POST",
    locale: payload.locale,
    token: payload.token,
    body: buildEducationFormData(payload, true),
  });

  if (!ok) {
    throw new Error(message || "Failed to update education.");
  }

  return data;
}

export async function deleteEducation({
  id,
  locale = "en",
  token,
}: {
  id: string;
  locale?: string;
  token: string;
}) {
  const { ok, data, message } = await apiFetch(`${getUserApiUrl()}/user-educations/${id}`, {
    method: "DELETE",
    locale,
    token,
    body: new FormData(),
  });

  if (!ok) {
    throw new Error(message || "Failed to delete education.");
  }

  return data;
}
