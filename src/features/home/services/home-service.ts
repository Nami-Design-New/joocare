import { formatDistanceToNowStrict } from "date-fns";
import { getBaseApiUrl } from "@/shared/lib/api-endpoints";
import type { HomePageData, HomePopularSearchesPage } from "../types/home.types";

type LocaleString = {
  ar?: string | null;
  en?: string | null;
};

type HomeApiResponse = {
  message?: string;
  data?: {
    home_section?: {
      title?: string | null;
      sub_title?: string | null;
      description?: string | null;
      countries?: Array<{ id?: number | string; name?: LocaleString | string | null }>;
      categories?: Array<{ id?: number | string; title?: LocaleString | string | null }>;
      domains?: Array<{ id?: number | string; title?: LocaleString | string | null }>;
    };
    how_it_works_section?: {
      title?: string | null;
      steps?: Array<{
        id?: number | string;
        title?: string | null;
        description?: string | null;
        image?: string | null;
      }>;
    };
    why_joocare?: {
      title?: string | null;
      legacy_model_title?: string | null;
      legacy_model_description?: string | null;
      legacy_models?: Array<{
        id?: number | string;
        title?: string | null;
        description?: string | null;
        icon?: string | null;
      }>;
      joocare_model_title?: string | null;
      joocare_model_description?: string | null;
      joocare_models?: Array<{
        id?: number | string;
        title?: string | null;
        description?: string | null;
      }>;
    };
    top_employers?: {
      title?: string | null;
      top_employers?: Array<{ id?: number | string; image?: string | null }>;
    };
    proven_hiring_impact?: {
      title?: string | null;
      description?: string | null;
    };
    recent_jobs?: {
      title?: string | null;
      jobs?: Array<{
        id?: number | string;
        title?: string | null;
        updated_at?: string | null;
        company?: {
          name?: string | null
          image: string | null
        } | string | null;
        job_title?: { title?: string | null } | null;
        country?: { name?: string | null } | null;
        city?: { name?: string | null } | null;
        employment_type?: { title?: string | null } | null;
        image?: string | null;
      }>;
    };
    rates?: {
      title?: string | null;
      rates?: Array<{
        id?: number | string;
        rate?: string | number | null;
        comment?: string | null;
        created_at?: string | null;
        name?: string | null;
        date?: string | null;
        text?: string | null;
      }>;
    };
    faqs?: {
      title?: string | null;
      faqs?: Array<{
        id?: number | string;
        question?: string | null;
        answer?: string | null;
      }>;
    };
  };
};

type SearchesApiResponse = {
  message?: string;
  code?: number;
  data?: Array<{
    id?: number | string;
    word?: string | null;
    count?: number | string | null;
  }>;
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
};

function resolveLocalizedText(value: LocaleString | string | null | undefined, locale: string) {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  return locale === "ar" ? value.ar ?? value.en ?? "" : value.en ?? value.ar ?? "";
}

function buildJobTimeLabel(value: string | null | undefined) {
  if (!value) {
    return "Recently posted";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently posted";
  }

  return formatDistanceToNowStrict(date, { addSuffix: true });
}

export async function getPopularSearchesPage({
  page = 1,
  limitPerPage = 10,
  locale,
}: {
  page?: number;
  limitPerPage?: number;
  locale: string;
}): Promise<HomePopularSearchesPage> {
  const params = new URLSearchParams({
    pagination: "on",
    limit_per_page: String(limitPerPage),
    page: String(page),
  });

  const response = await fetch(`${getBaseApiUrl()}/searches?${params.toString()}`, {
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
    next: {
      revalidate: 300,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to load popular searches.");
  }

  const payload = (await response.json()) as SearchesApiResponse;

  return {
    items:
      payload.data?.map((search, index) => ({
        id: String(search.id ?? `${page}-${index}`),
        label: search.word?.trim() ?? "",
        count: Number(search.count ?? 0),
      })).filter((search) => Boolean(search.label)) ?? [],
    currentPage: payload.current_page ?? page,
    lastPage: payload.last_page ?? page,
    perPage: payload.per_page ?? limitPerPage,
    total: payload.total ?? 0,
  };
}

export async function getHomePageData(locale: string): Promise<HomePageData> {
  const response = await fetch(`${getBaseApiUrl()}/home`, {
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
    next: {
      revalidate: 300,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to load home page.");
  }

  const payload = (await response.json()) as HomeApiResponse;
  const data = payload.data;

  if (!data) {
    throw new Error(payload.message || "Failed to load home page.");
  }

  const homeSection = data.home_section;
  const whyJoocare = data.why_joocare;
  const recentJobs = data.recent_jobs;
  const rates = data.rates;
  const faqs = data.faqs;

  return {
    hero: {
      title: homeSection?.title ?? "",
      subtitle: homeSection?.sub_title ?? "",
      description: homeSection?.description ?? "",
      countries:
        homeSection?.countries?.map((country) => ({
          id: String(country.id ?? ""),
          label: resolveLocalizedText(country.name, locale),
        })) ?? [],
      categories:
        homeSection?.categories?.map((category) => ({
          id: String(category.id ?? ""),
          label: resolveLocalizedText(category.title, locale),
        })) ?? [],
      domains:
        homeSection?.domains?.map((domain) => ({
          id: String(domain.id ?? ""),
          label: resolveLocalizedText(domain.title, locale),
        })) ?? [],
    },
    howItWorks: {
      title: data.how_it_works_section?.title ?? "",
      steps:
        data.how_it_works_section?.steps?.map((step) => ({
          id: String(step.id ?? ""),
          title: step.title ?? "",
          description: step.description ?? "",
          image: step.image ?? "/assets/default/default.png",
        })) ?? [],
    },
    whyJoocare: {
      title: whyJoocare?.title ?? "",
      legacyModelTitle: whyJoocare?.legacy_model_title ?? "",
      legacyModelDescription: whyJoocare?.legacy_model_description ?? "",
      legacyModels: whyJoocare?.legacy_models?.map((model) => ({
        id: String(model.id ?? ""),
        title: model.title ?? "",
        description: model.description ?? "",
        icon: model.icon ?? "",
      })) ?? [],
      joocareModelTitle: whyJoocare?.joocare_model_title ?? "",
      joocareModelDescription: whyJoocare?.joocare_model_description ?? "",
      joocareModels:
        whyJoocare?.joocare_models?.map((model) => ({
          id: String(model.id ?? ""),
          title: model.title ?? "",
          description: model.description ?? "",
        })) ?? [],
    },
    topEmployers: {
      title: data.top_employers?.title ?? "",
      companies:
        data.top_employers?.top_employers?.map((company) => ({
          id: String(company.id ?? ""),
          image: company.image ?? null,
        })) ?? [],
    },
    impact: {
      title: data.proven_hiring_impact?.title ?? "",
      description: data.proven_hiring_impact?.description ?? "",
    },
    recentJobs: {
      title: recentJobs?.title ?? "",
      jobs:
        recentJobs?.jobs?.map((job) => {
          const locationParts = [job.city?.name, job.country?.name].filter(Boolean);

          return {
            id: String(job.id ?? ""),
            title: job.title ?? job.job_title?.title ?? "Untitled role",
            company:
              typeof job.company === "string"
                ? job.company
                : job.company?.name ?? "Joocare Employer",
            location: locationParts.join(", ") || "Location not specified",
            type: job.employment_type?.title ?? "Not specified",
            timeLabel: buildJobTimeLabel(job.updated_at),
            image: typeof job.company === "string"
              ? job.company
              : job.company?.image ?? "/assets/recent-job-image.svg",
            updated_at: job.updated_at ?? "",
          };
        }) ?? [],
    },
    rates: {
      title: rates?.title ?? "",
      items:
        rates?.rates?.map((rate) => ({
          id: String(rate.id ?? ""),
          name: rate?.name ?? "Anonymous professional",
          date: rate.date,
          text: rate.comment ?? "",
          rate: Number(rate.rate ?? 0),
        })) ?? [],
    },
    faqs: {
      title: faqs?.title ?? "",
      items:
        faqs?.faqs?.map((faq) => ({
          id: String(faq.id ?? ""),
          question: faq.question ?? "",
          answer: faq.answer ?? "",
        })) ?? [],
    },
  };
}
