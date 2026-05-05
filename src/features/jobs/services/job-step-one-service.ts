import { apiFetch } from "@/shared/lib/fetch-manager";
import { JobStepOnePayload } from "../types/job-steps.types";

export async function jobStepOneService(
    payload: JobStepOnePayload,
    { token }: { token: string }
) {
    const formData = new FormData();

    if (payload.job_title_id !== undefined) formData.append("job_title_id", String(payload.job_title_id));
    if (payload.title !== undefined) formData.append("title", payload.title);
    formData.append("professional_license", payload.professional_license);
    formData.append("has_salary", String(payload.has_salary));
    if (payload.min_salary !== undefined) formData.append("min_salary", String(payload.min_salary));
    if (payload.max_salary !== undefined) formData.append("max_salary", String(payload.max_salary));
    if (payload.currency_id !== undefined) formData.append("currency_id", String(payload.currency_id));
    if (payload.salary_type_id !== undefined) formData.append("salary_type_id", String(payload.salary_type_id));
    formData.append("category_id", String(payload.category_id));
    formData.append("specialty_id", String(payload.specialty_id));
    formData.append("employment_type_id", String(payload.employment_type_id));
    formData.append("role_category_id", String(payload.role_category_id));
    formData.append("seniority_level_id", String(payload.seniority_level_id));
    formData.append("country_id", String(payload.country_id));
    formData.append("city_id", String(payload.city_id));
    formData.append("experience_id", String(payload.experience_id));
    formData.append("availability_id", String(payload.availability_id));

    payload.mandatory_certifications.forEach((item, index) => {
        formData.append(`mandatory_certifications[${index}]`, String(item));
    });

    payload.education_levels.forEach((item, index) => {
        formData.append(`education_levels[${index}]`, String(item));
    });

    const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_BASE_COMPANY_URL}/jobs-step-one`,
        {
            method: "POST",
            body: formData,
            token,
        }
    );
    if (!response.ok) {
        throw new Error(response.message ?? "Failed to update bio");
    }

    return response;
}
