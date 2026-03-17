export type JobStatus = "open" | "closed" | "paused";
export type Applicant = {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  cvUrl: string;
};
