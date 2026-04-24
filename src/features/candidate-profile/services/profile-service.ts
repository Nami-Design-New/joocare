import "server-only";
import { getLocale } from "next-intl/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getUserApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";
import type {
  CandidateProfileApiEducation,
  CandidateProfileApiExperience,
  CandidateProfileApiUser,
  CandidateEducationViewModel,
  CandidateExperienceViewModel,
  CandidateProfileViewModel,
  CandidateSkillViewModel,
  CandidateProfileApiLookup,
} from "../types/profile.types";

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
    gpa:
      entry.gpa === null || entry.gpa === undefined || entry.gpa === ""
        ? null
        : String(entry.gpa),
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
    bullets: (entry.responsibilities ?? [])
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

function resolveJobTitle(
  title: CandidateProfileApiLookup | string | null | undefined,
) {
  if (typeof title === "string") {
    return title.trim() || null;
  }

  return title?.title ?? title?.name ?? null;
}

function resolveStoredFileUrl(path: string | null | undefined) {
  if (!path) {
    return null;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const trimmedPath = path.trim().replace(/^\/+/, "");
  const normalizedPath = trimmedPath.startsWith("storage/")
    ? trimmedPath.slice("storage/".length)
    : trimmedPath;

  return `https://joocare.nami-tec.com/storage/${normalizedPath}`;
}

export async function getCandidateProfile() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken || session.authRole !== "candidate") {
    return null;
  }

  const locale = await getLocale();
  const { ok, data } = await apiFetch<CandidateProfileApiUser>(
    `${getUserApiUrl()}/auth/profile`,
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
  const jobTitle = resolveJobTitle(user.title);
  const fullPhone =
    user.phone && user.phone_code ? `${user.phone_code}${user.phone}` : user.phone;
  const skills = (user.skills ?? []).map((skill) => ({
    id: String(skill.id),
    label: skill.title,
    deleteId: String(skill.id),
  })) satisfies CandidateSkillViewModel[];
  const educations = (user.educations ?? []).map(mapEducation);
  const experiences = (user.experiences ?? []).map(mapExperience);
  const experienceLabel =
    typeof user.experience === "string"
      ? user.experience
      : user.experience?.title ?? user.experience?.name ?? null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    phoneCode: user.phone_code,
    fullPhone: fullPhone ?? null,
    jobTitleId: user.job_title_id ? String(user.job_title_id) : null,
    specialtyId: user.specialty_id ? String(user.specialty_id) : null,
    experienceId: user.experience_id ? String(user.experience_id) : null,
    countryId: user.country_id ? String(user.country_id) : null,
    cityId: user.city_id ? String(user.city_id) : null,
    birthDate: user.birth_date ?? user.date_of_birth ?? null,
    image: resolveStoredFileUrl(user.image),
    cv: resolveStoredFileUrl(user.cv),
    bio: user.bio ?? null,
    isProfileComplete: user.is_profile_complete ?? null,
    age: normalizeAge(user.age),
    experience: experienceLabel,
    location: buildLocation(country, city),
    jobTitle,
    skills,
    educations,
    experiences,
    hiring_readiness_score: user.hiring_readiness_score ?? null,
  } satisfies CandidateProfileViewModel;
}
