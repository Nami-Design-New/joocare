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
    assessment_id?: number | string,
}

export type JobStepTwoPayload = {
    description: string;
    skills: number[];
    screening_questions?: ScreeningQuestion[];
};

export type ScreeningQuestionOption = { id: string; text: string };

export type ScreeningQuestion = {
    id: string;
    source: 'template' | 'custom';
    templateId?: string;
    type: 'single' | 'multi' | 'yes-no' | 'text';
    question: string;
    mark: number;
    options: ScreeningQuestionOption[];
    correctOptionIds: string[];
    correctText?: string;
    required: boolean;
};

export type JobStepThreePayload = {
    status: "draft" | "open";
};

export type AiChatAttachment = {
    id: string;
    name: string;
    size: number;
    kind: 'image' | 'file';
    // Object URL for files picked in this session.
    url?: string;
};

export type AiChatMessage = {
    id: string;
    author: 'user' | 'assistant';
    sentAt: string;
    text: string;
    attachments?: AiChatAttachment[];
    // Assistant "Professional Insight" card with an Apply action.
    insight?: { suggestion: string; note: string };
};
