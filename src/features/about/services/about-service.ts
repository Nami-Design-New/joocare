import { getBaseApiUrl } from "@/shared/lib/api-endpoints";
import type { AboutPageData } from "../types/about.types";

type AboutApiResponse = {
  message?: string;
  data?: {
    about_section?: {
      title?: string | null;
      description?: string | null;
      items?: Array<{
        id?: number | string;
        title?: string | null;
        description?: string | null;
        icon?: string | null;
      }>;
      images?: Array<{
        id?: number | string;
        image?: string | null;
        alt?: string | null;
      }>;
    };
    choose_us?: {
      title?: string | null;
      items?: Array<{
        id?: number | string;
        title?: string | null;
        description?: string | null;
      }>;
      images?: Array<{
        id?: number | string;
        image?: string | null;
        alt?: string | null;
      }>;
    };
    our_vision?: {
      title?: string | null;
      description?: string | null;
      images?: Array<{
        id?: number | string;
        image?: string | null;
        alt?: string | null;
      }>;
    };
    our_mission?: {
      title?: string | null;
      description?: string | null;
      images?: Array<{
        id?: number | string;
        image?: string | null;
        alt?: string | null;
      }>;
    };
  };
};

function mapImages(
  images:
    | Array<{
        id?: number | string;
        image?: string | null;
        alt?: string | null;
      }>
    | undefined,
) {
  return (
    images
      ?.filter((image) => image.image)
      .map((image) => ({
        id: String(image.id ?? ""),
        image: image.image ?? "",
        alt: image.alt ?? "About image",
      })) ?? []
  );
}

export async function getAboutPageData(locale: string): Promise<AboutPageData> {
  const response = await fetch(`${getBaseApiUrl()}/about`, {
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
    next: {
      revalidate: 300,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to load about page.");
  }

  const payload = (await response.json()) as AboutApiResponse;
  const data = payload.data;

  if (!data) {
    throw new Error(payload.message || "Failed to load about page.");
  }

  return {
    aboutSection: {
      title: data.about_section?.title ?? "",
      description: data.about_section?.description ?? "",
      items:
        data.about_section?.items?.map((item) => ({
          id: String(item.id ?? ""),
          title: item.title ?? "",
          description: item.description ?? "",
          icon: item.icon ?? null,
        })) ?? [],
      images: mapImages(data.about_section?.images),
    },
    chooseUs: {
      title: data.choose_us?.title ?? "",
      items:
        data.choose_us?.items?.map((item) => ({
          id: String(item.id ?? ""),
          title: item.title ?? "",
          content: item.description ?? "",
        })) ?? [],
      images: mapImages(data.choose_us?.images),
    },
    vision: {
      title: data.our_vision?.title ?? "",
      description: data.our_vision?.description ?? "",
      images: mapImages(data.our_vision?.images),
    },
    mission: {
      title: data.our_mission?.title ?? "",
      description: data.our_mission?.description ?? "",
      images: mapImages(data.our_mission?.images),
    },
  };
}
