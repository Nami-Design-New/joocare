export type JobStepOnePayload = {
    job_title_id?: number,
    professional_license: string,
    min_salary?: number,
    max_salary?: number,
    currency_id?: number,
    salary_type_id?: number,
    category_id?: number,
    category_title?: string,
    specialty_title: string,
    employment_type_id: number,
    role_category_id: number,
    seniority_level_id: number,
    country_id: number,
    city_id: number,
    experience_id?: number,
    experience_title?: string,
    mandatory_certifications: Array<number | string>,
    education_levels: number[],
    availability_id?: number,
    availability_title?: string,
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
