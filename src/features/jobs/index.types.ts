export type JobStatus = "open" | "closed" | "paused";
export type Applicant = {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  cvUrl: string;
};

// Candidate jobs
// -- Candidate Filter Section

export interface FilterState {
  professionalLicense: string[];
  roleCategory: string[];
  seniorityLevel: string[];
  byDomain: string[];
  speciality: string[];
  experienceLevel: string[];
  availability: string[];
  employerType: string[];
  salaryMin: string;
  salaryMax: string;
  salaryType: string;
}

export interface AccordionSection {
  key: keyof Omit<FilterState, "salaryMin" | "salaryMax" | "salaryType">;
  label: string;
  options: string[];
}
