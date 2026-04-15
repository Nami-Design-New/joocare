export type JobStepOnePayload = {
    job_title_id?: number,
    professional_license: string,
    min_salary?: number,
    max_salary?: number,
    currency_id?: number,
    salary_type_id?: number,
    category_id: number,
    specialty_id: number,
    employment_type_id: number,
    role_category_id: number,
    seniority_level_id: number,
    country_id: number,
    city_id: number,
    experience_id: number,
    mandatory_certifications: number[],
    education_levels: number[],
    availability_id: number,
    has_salary: 0 | 1,
    title?: string,
}

export type JobStepTwoPayload = {
    description: string;
    skills: number[];
};

export type JobStepThreePayload = {
    status: "draft" | "open";
};
