import { apiFetch } from "@/shared/lib/fetch-manager";

export type UpdateJobPayload = {
  _method: "put";
  professional_license?: string;
  min_salary?: number;
  max_salary?: number;
  currency_id?: number;
  salary_type_id?: number;
  category_id?: number;
  specialty_id?: number;
  employment_type_id?: number;
  role_category_id?: number;
  country_id?: number;
  city_id?: number;
  experience_id?: number;
  mandatory_certifications?: number[];
  education_levels?: number[];
  availability_id?: number;
  has_salary?: number;
  skills?: number[];
  description?: string;
  status?: string;
  title?: string;
  job_title_id?: number;
  seniority_level_id?: number;
};

/**
 * Update an existing job via POST with `_method: put` (Laravel-style method spoofing).
 * Sends all fields at once — used by the "Edit" mode.
 */
export async function updateJobService(
  jobId: number | string,
  payload: UpdateJobPayload,
  { token }: { token: string }
) {
  const formData = new FormData();

  // _method is required for Laravel PUT spoofing
  formData.append("_method", "put");

  if (payload.title !== undefined) formData.append("title", payload.title);
  if (payload.job_title_id !== undefined) formData.append("job_title_id", String(payload.job_title_id));
  if (payload.professional_license !== undefined) formData.append("professional_license", payload.professional_license);
  if (payload.has_salary !== undefined) formData.append("has_salary", String(payload.has_salary));
  if (payload.min_salary !== undefined) formData.append("min_salary", String(payload.min_salary));
  if (payload.max_salary !== undefined) formData.append("max_salary", String(payload.max_salary));
  if (payload.currency_id !== undefined) formData.append("currency_id", String(payload.currency_id));
  if (payload.salary_type_id !== undefined) formData.append("salary_type_id", String(payload.salary_type_id));
  if (payload.category_id !== undefined) formData.append("category_id", String(payload.category_id));
  if (payload.specialty_id !== undefined) formData.append("specialty_id", String(payload.specialty_id));
  if (payload.employment_type_id !== undefined) formData.append("employment_type_id", String(payload.employment_type_id));
  if (payload.role_category_id !== undefined) formData.append("role_category_id", String(payload.role_category_id));
  if (payload.seniority_level_id !== undefined) formData.append("seniority_level_id", String(payload.seniority_level_id));
  if (payload.country_id !== undefined) formData.append("country_id", String(payload.country_id));
  if (payload.city_id !== undefined) formData.append("city_id", String(payload.city_id));
  if (payload.experience_id !== undefined) formData.append("experience_id", String(payload.experience_id));
  if (payload.education_levels) {
    payload.education_levels.forEach((educationLevelId, index) => {
      formData.append(`education_levels[${index}]`, String(educationLevelId));
    });
  }
  if (payload.availability_id !== undefined) formData.append("availability_id", String(payload.availability_id));
  if (payload.description !== undefined) formData.append("description", payload.description);
  if (payload.status !== undefined) formData.append("status", payload.status);

  if (payload.skills) {
    payload.skills.forEach((skillId, index) => {
      formData.append(`skills[${index}]`, String(skillId));
    });
  }

  if (payload.mandatory_certifications) {
    payload.mandatory_certifications.forEach((certId, index) => {
      formData.append(`mandatory_certifications[${index}]`, String(certId));
    });
  }

  const response = await apiFetch(
    `${process.env.NEXT_PUBLIC_BASE_COMPANY_URL}/jobs/${jobId}`,
    {
      method: "POST",
      body: formData,
      token,
    }
  );

  if (!response.ok) {
    throw new Error(response.message ?? "Failed to update job");
  }

  return response;
}
