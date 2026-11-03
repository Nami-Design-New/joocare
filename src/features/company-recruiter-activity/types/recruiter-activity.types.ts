export type RecruiterJobStatus = 'open' | 'closed' | 'draft';

export type RecruiterActivity = {
  id: string;
  name: string;
  isDeleted: boolean;
  jobs: Record<RecruiterJobStatus, number>;
  projects: number;
};
