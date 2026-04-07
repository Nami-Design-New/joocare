import "server-only";
import { getLocale } from "next-intl/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { apiFetch } from "@/shared/lib/fetch-manager";
import type {
  CandidateEducationViewModel,
  CandidateExperienceViewModel,
  CandidateProfileViewModel,
} from "../types/profile.types";

type CandidateProfileNamedRecord = {
  id: number;
  name?: string;
  title?: string;
};

type CandidateProfileApiSkill = {
  id: number;
  title: string;
};

type CandidateProfileApiResponsibility = {
  id: number;
  description: string;
};

type CandidateProfileApiExperience = {
  id: number;
  title: string;
  company: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  responsibilities: CandidateProfileApiResponsibility[];
};

type CandidateProfileApiEducation = {
  id: number;
  degree: string | null;
  university: string | null;
  country_id: number | null;
  start_date: string | null;
  end_date: string | null;
};

type CandidateProfileApiUser = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  phone_code: string | null;
  job_title: CandidateProfileNamedRecord | null;
  country: CandidateProfileNamedRecord | null;
  city: CandidateProfileNamedRecord | null;
  image: string | null;
  cv: string | null;
  age: number | string | null;
  bio: string | null;
  experiences: CandidateProfileApiExperience[];
  educations: CandidateProfileApiEducation[];
  skills: CandidateProfileApiSkill[];
};

function normalizeDateLabel(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

function mapEducation(entry: CandidateProfileApiEducation): CandidateEducationViewModel {
  const startYear = normalizeDateLabel(entry.start_date);
  const endYear = entry.end_date ? normalizeDateLabel(entry.end_date) : "Present";
  const period =
    startYear && endYear ? `${startYear} - ${endYear}` : startYear ?? endYear ?? null;

  return {
    id: String(entry.id),
    university: entry.university ?? "Education",
    degree: entry.degree,
    period,
    countryId: entry.country_id ? String(entry.country_id) : null,
    startDate: entry.start_date,
    endDate: entry.end_date,
  };
}

function mapExperience(entry: CandidateProfileApiExperience): CandidateExperienceViewModel {
  return {
    id: String(entry.id),
    title: entry.title || "Experience",
    organization: entry.company,
    startDate: entry.start_date,
    endDate: entry.end_date,
    startDateLabel: normalizeDateLabel(entry.start_date),
    endDateLabel: entry.is_current
      ? "Present"
      : normalizeDateLabel(entry.end_date) ?? "Present",
    isCurrent: entry.is_current,
    bullets: entry.responsibilities
      .map((responsibility) => responsibility.description)
      .filter(Boolean),
  };
}

function buildLocation(country: string | null, city: string | null) {
  if (city && country) {
    return `${city}, ${country}`;
  }

  return city ?? country ?? null;
}

function normalizeAge(age: number | string | null | undefined) {
  if (typeof age === "number") {
    return Number.isNaN(age) ? null : age;
  }

  if (typeof age === "string") {
    const parsed = Number.parseInt(age, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }

  return null;
}

export async function getCandidateProfile() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken || session.authRole !== "candidate") {
    return null;
  }

  const locale = await getLocale();
  const { ok, data } = await apiFetch<CandidateProfileApiUser>(
    `${process.env.NEXT_PUBLIC_BASE_USER_URL}/auth/profile`,
    {
      method: "GET",
      locale,
      token: String(session.accessToken),
    },
  );

  const user = data?.data;

  if (!ok || !user?.id) {
    return null;
  }

  const country = user.country?.name ?? null;
  const city = user.city?.name ?? null;
  const jobTitle = user.job_title?.title ?? null;
  const fullPhone =
    user.phone && user.phone_code ? `${user.phone_code}${user.phone}` : user.phone;
  const skills = user.skills.map((skill) => skill.title);
  const educations = user.educations.map(mapEducation);
  const experiences = user.experiences.map(mapExperience);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    phoneCode: user.phone_code,
    fullPhone: fullPhone ?? null,
    image: user.image ?? null,
    cv: user.cv ?? null,
    bio: user.bio ?? null,
    age: normalizeAge(user.age),
    location: buildLocation(country, city),
    jobTitle,
    skills,
    educations,
    experiences,
  } satisfies CandidateProfileViewModel;
}
