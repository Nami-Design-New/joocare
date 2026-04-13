import { getBaseApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";
import { parsePhoneNumber } from "react-phone-number-input";
import type { ContactFormValues } from "../types";

export async function submitContactService({
  data,
  locale,
}: {
  data: ContactFormValues;
  locale: string;
}) {
  const parsedPhone = data.phone ? parsePhoneNumber(data.phone) : undefined;
  const formData = new FormData();

  let endpoint = `${getBaseApiUrl()}/contacts`;

  if (data.role === "employer") {
    endpoint = `${getBaseApiUrl()}/demo-requests`;
    formData.append("company_name", data.name);
    formData.append("email", data.email);
    formData.append("inquiry_type_id", data.inquiryTypeId);
    formData.append("message", data.message);
    formData.append("phone", parsedPhone?.nationalNumber ?? "");
    formData.append(
      "phone_code",
      parsedPhone?.countryCallingCode ? `+${parsedPhone.countryCallingCode}` : "",
    );
    formData.append("country_id", data.countryId);
    formData.append("city_id", data.cityId);
  } else {
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("inquiry_type_id", data.inquiryTypeId);
    formData.append("message", data.message);
  }

  const { ok, message } = await apiFetch(endpoint, {
    method: "POST",
    locale,
    body: formData,
  });

  if (!ok) {
    throw new Error(message || "Failed to send your message.");
  }
}
