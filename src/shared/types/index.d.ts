export interface IUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  phone_code: string;
  job_title_id: number | null;
  job_title: string | null;
  country_id: number | null;
  country: string | null;
  city_id: number | null;
  city: string | null;
  cv: string | null;
  image: string | null;
  experience_id: number | null;
  age: number | null;
  bio: string | null;
  licenses: [key: string];
  certifications: [key: string];
  qualifications: [key: string];
  experiences: [key: string];
  educations: [key: string];
  created_at: string;
  updated_at: string;
}
