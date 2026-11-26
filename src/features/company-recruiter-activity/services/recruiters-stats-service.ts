import { getCompanyApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch, type ApiFetchResponse } from '@/shared/lib/fetch-manager';
import { RECRUITER_ACTIVITY_PAGE_SIZE } from '../constants';
import type {
  ApiRecruiterStats,
  ApiRecruitersStatsPage,
  RecruiterActivity,
  RecruiterActivityPage,
  RecruiterOption,
} from '../types/recruiter-activity.types';

type RequestOptions = {
  token: string;
  locale: string;
};

type GetRecruitersStatsParams = {
  page: number;
  adminId: string;
};

// The list comes back as a Laravel page: rows in `data`, paging fields beside it.
type RecruitersStatsResponse = ApiFetchResponse<ApiRecruiterStats[]> &
  Partial<Omit<ApiRecruitersStatsPage, 'data'>>;

export async function getRecruitersStats(
  { page, adminId }: GetRecruitersStatsParams,
  { token, locale }: RequestOptions,
): Promise<RecruiterActivityPage> {
  const params = new URLSearchParams({
    pagination: 'on',
    limit_per_page: String(RECRUITER_ACTIVITY_PAGE_SIZE),
    page: String(page),
  });
  if (adminId) params.set('admin_id', adminId);

  const { ok, data, message } = await apiFetch<ApiRecruiterStats[]>(
    `${getCompanyApiUrl()}/recruiters-stats?${params.toString()}`,
    { method: 'GET', token, locale },
  );
  if (!ok || !data) {
    throw new Error(message || 'Failed to load recruiter activity.');
  }

  const pageData: RecruitersStatsResponse = data;
  return {
    recruiters: (pageData.data ?? []).map(mapRecruiterActivity),
    total: pageData.total ?? 0,
    perPage: pageData.per_page ?? RECRUITER_ACTIVITY_PAGE_SIZE,
    lastPage: pageData.last_page ?? 1,
  };
}

// Without `pagination=on` the endpoint returns every recruiter at once.
export async function getRecruiterOptions({
  token,
  locale,
}: RequestOptions): Promise<RecruiterOption[]> {
  const { ok, data, message } = await apiFetch<RecruiterOption[]>(
    `${getCompanyApiUrl()}/recruiters-list`,
    { method: 'GET', token, locale },
  );
  if (!ok) throw new Error(message || 'Failed to load recruiters.');

  return (data?.data ?? []).map(({ id, name }) => ({ id, name }));
}

function mapRecruiterActivity(recruiter: ApiRecruiterStats): RecruiterActivity {
  return {
    id: recruiter.id,
    name: recruiter.name,
    // Not returned by every backend environment yet.
    isDeleted: recruiter.is_deleted ?? false,
    jobs: {
      open: recruiter.open_jobs,
      closed: recruiter.closed_jobs,
      draft: recruiter.draft_jobs,
    },
    projects: recruiter.projects,
  };
}
