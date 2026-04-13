import type {
  EmployerFaqApiModel,
  EmployerFaqItem,
  EmployerHomeImage,
  EmployerHomeItem,
  EmployerImageApiModel,
  EmployerItemApiModel,
} from "./types";

export const employerHeroFallbackImages: EmployerHomeImage[] = [
  { id: "1", image: "/assets/employers/1.png", alt: "Employer hero image 1" },
  { id: "2", image: "/assets/employers/2.png", alt: "Employer hero image 2" },
  { id: "3", image: "/assets/employers/3.png", alt: "Employer hero image 3" },
];

export const employerHireFallbackStepImages = [
  "/assets/employers/company.gif",
  "/assets/employers/search.gif",
  "/assets/employers/artboard.gif",
];

export function mapImage(
  image: EmployerImageApiModel | null | undefined,
  fallbackAlt: string,
): EmployerHomeImage | null {
  if (!image?.image) {
    return null;
  }

  return {
    id: String(image.id ?? ""),
    image: image.image,
    alt: image.alt ?? fallbackAlt,
  };
}

export function mapImages(
  images: EmployerImageApiModel[] | undefined,
  fallbackAlt: string,
): EmployerHomeImage[] {
  return (
    images
      ?.map((image) => mapImage(image, fallbackAlt))
      .filter((image): image is EmployerHomeImage => Boolean(image)) ?? []
  );
}

export function mapItems(
  items: EmployerItemApiModel[] | undefined,
): EmployerHomeItem[] {
  return (
    items?.map((item) => ({
      id: String(item.id ?? ""),
      title: item.title ?? "",
      description: item.description ?? "",
      image: item.image ?? null,
    })) ?? []
  );
}

export function mapFaqs(items: EmployerFaqApiModel[] | undefined): EmployerFaqItem[] {
  return (
    items?.map((item) => ({
      id: String(item.id ?? ""),
      question: item.question ?? "",
      answer: item.answer ?? "",
    })) ?? []
  );
}
