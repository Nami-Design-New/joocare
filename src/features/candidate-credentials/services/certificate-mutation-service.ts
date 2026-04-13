import { getUserApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";

type CertificateMutationPayload = {
  name: string;
  company: string;
  startDate: string;
  endDate?: string;
  image?: string | null;
  locale?: string;
  token: string;
};

function buildCertificateFormData(
  payload: CertificateMutationPayload,
  includeMethodOverride = false,
) {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("company", payload.company);
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

export async function createCertificate(payload: CertificateMutationPayload) {
  const { ok, data, message } = await apiFetch(`${getUserApiUrl()}/certifications`, {
    method: "POST",
    locale: payload.locale,
    token: payload.token,
    body: buildCertificateFormData(payload),
  });

  if (!ok) {
    throw new Error(message || "Failed to add certificate.");
  }

  return data;
}

export async function updateCertificate(
  id: string,
  payload: CertificateMutationPayload,
) {
  const { ok, data, message } = await apiFetch(
    `${getUserApiUrl()}/certifications/${id}`,
    {
      method: "POST",
      locale: payload.locale,
      token: payload.token,
      body: buildCertificateFormData(payload, true),
    },
  );

  if (!ok) {
    throw new Error(message || "Failed to update certificate.");
  }

  return data;
}

export async function deleteCertificate({
  id,
  locale = "en",
  token,
}: {
  id: string;
  locale?: string;
  token: string;
}) {
  const { ok, data, message } = await apiFetch(
    `${getUserApiUrl()}/certifications/${id}`,
    {
      method: "DELETE",
      locale,
      token,
      body: new FormData(),
    },
  );

  if (!ok) {
    throw new Error(message || "Failed to delete certificate.");
  }

  return data;
}
