import { getUserApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";

type QualificationMutationPayload = {
  degree: string;
  university: string;
  countryId: string;
  startDate: string;
  endDate?: string;
  image?: string | null;
  locale?: string;
  token: string;
};

function buildQualificationFormData(
  payload: QualificationMutationPayload,
  includeMethodOverride = false,
) {
  const formData = new FormData();
  formData.append("degree", payload.degree);
  formData.append("university", payload.university);
  formData.append("country_id", payload.countryId);
  formData.append("start_date", payload.startDate);

  if (payload.endDate) {
    formData.append("end_date", payload.endDate);
  }

  if (payload.image) {
    formData.append("image", payload.image);
  }

  if (includeMethodOverride) {
    formData.append("_method", "put");
  }

  return formData;
}

export async function createQualification(payload: QualificationMutationPayload) {
  const { ok, data, message } = await apiFetch(`${getUserApiUrl()}/qualifications`, {
    method: "POST",
    locale: payload.locale,
    token: payload.token,
    body: buildQualificationFormData(payload),
  });

  if (!ok) {
    throw new Error(message || "Failed to add qualification.");
  }

  return data;
}

export async function updateQualification(
  id: string,
  payload: QualificationMutationPayload,
) {
  const { ok, data, message } = await apiFetch(
    `${getUserApiUrl()}/qualifications/${id}`,
    {
      method: "POST",
      locale: payload.locale,
      token: payload.token,
      body: buildQualificationFormData(payload, true),
    },
  );

  if (!ok) {
    throw new Error(message || "Failed to update qualification.");
  }

  return data;
}

export async function deleteQualification({
  id,
  locale = "en",
  token,
}: {
  id: string;
  locale?: string;
  token: string;
}) {
  const { ok, data, message } = await apiFetch(
    `${getUserApiUrl()}/qualifications/${id}`,
    {
      method: "DELETE",
      locale,
      token,
      body: new FormData(),
    },
  );

  if (!ok) {
    throw new Error(message || "Failed to delete qualification.");
  }

  return data;
}
