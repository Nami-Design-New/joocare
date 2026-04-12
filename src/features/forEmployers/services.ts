import { getCompanyApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";
import type {
  ForEmployersApiResponse,
  ForEmployersPageData,
} from "./types";
import { mapFaqs, mapImage, mapImages, mapItems } from "./utils";

export async function getForEmployersPageData(
  locale: string,
): Promise<ForEmployersPageData> {
  const { ok, data, message } = await apiFetch<ForEmployersApiResponse>(
    `${getCompanyApiUrl()}/home`,
    {
      method: "GET",
      locale,
      cache: "no-store",
    },
  );

  if (!ok || !data?.data) {
    throw new Error(message || "Failed to load employer home page.");
  }

  const payload = data.data;

  return {
    hero: {
      title: payload.home_section?.title ?? "",
      description: payload.home_section?.description ?? "",
      images: mapImages(payload.home_section?.images, "Employer home image"),
    },
    banner: {
      title: payload.hire_professional_section?.title ?? "",
      description: payload.hire_professional_section?.description ?? "",
      image: mapImage(
        payload.hire_professional_section?.image,
        "Hire professional image",
      ),
    },
    whyJoocare: {
      title: payload.why_joocare?.title ?? "",
      description: payload.why_joocare?.description ?? "",
      items: mapItems(payload.why_joocare?.items),
    },
    hireSteps: {
      title: payload.hire_steps_section?.title ?? "",
      description: payload.hire_steps_section?.description ?? "",
      items: mapItems(payload.hire_steps_section?.items),
    },
    faqs: {
      title: payload.faqs_section?.title ?? "",
      items: mapFaqs(payload.faqs_section?.items),
    },
  };
}
