
import { JobsListingResponse } from "../jobs/types/jobs.types";

export type CompanyBase = {
    id: number;
    name: string | null;
    image: string | null;
    cover: string | null;
};


export type CompanyProfile = CompanyBase & {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
    snapchat: string;
    bio: string;
    created_at: string;
    updated_at: string;
};

export type CompanyProfileApiResponse = {
    message: string,
    data: { company: CompanyProfile }
};

export type CompanyJobsResponse = JobsListingResponse;
