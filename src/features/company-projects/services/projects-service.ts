import { readPaginationMeta } from '@/features/company-assessments/utils/pagination';
import { getCompanyApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch } from '@/shared/lib/fetch-manager';
import { createHttpStatusError } from '@/shared/lib/http-error';
import type {
  CompanyProject,
  ProjectCandidate,
  ProjectDetails,
  ProjectUserApiItem,
  HiringManagerApiItem,
  HiringManagerOption,
  ProjectApiItem,
  ProjectOptionsPage,
  ProjectRequestOptions,
  ProjectsListPage,
} from '../types/company-projects.types';

// `#` marks fields the projects API does not return yet.
const MISSING_API_VALUE = '#';

// Splits "23 November 2026 , 9:30AM" into its date and time parts.
function splitApiDateTime(value: string) {
  const [date = '', time = ''] = value.split(',').map((part) => part.trim());
  return { date: date || MISSING_API_VALUE, time: time || MISSING_API_VALUE };
}

// Candidates count, recruiter and closing have no API yet. Shares come from
// `assignees` (the hiring managers) and the project creator.
function mapProject(item: ProjectApiItem): CompanyProject {
  return {
    id: String(item.id),
    name: item.name,
    createdAt: item.created_at,
    createdBy: item.creator?.name ?? '',
    recruiter: '',
    candidateInitials: [],
    additionalCandidates: 0,
    isClosed: false,
    shareLogs: (item.assignees ?? []).map((assignee) => ({
      id: String(assignee.id),
      manager: assignee.name,
      managerEmail: assignee.email,
      sharedBy: item.creator?.name ?? MISSING_API_VALUE,
      sharedByRole: item.creator?.display_role ?? MISSING_API_VALUE,
      ...splitApiDateTime(assignee.created_at),
    })),
  };
}

export async function getProjects(
  search: string,
  page: number,
  limitPerPage: number,
  { token, locale }: ProjectRequestOptions,
): Promise<ProjectsListPage> {
  const params = new URLSearchParams({
    pagination: 'on',
    limit_per_page: String(limitPerPage),
    page: String(page),
  });
  if (search.trim()) params.set('search', search.trim());

  const { ok, data, message } = await apiFetch<ProjectApiItem[]>(
    `${getCompanyApiUrl()}/projects?${params.toString()}`,
    { token, locale, cache: 'no-store' },
  );
  if (!ok) throw new Error(message ?? '');
  const meta = readPaginationMeta(data, limitPerPage);
  return {
    items: (data?.data ?? []).map(mapProject),
    total: meta.total,
    perPage: meta.perPage,
  };
}

// Every row the API returns is shown. The same user can appear more than once
// (one row per add), so the row id also carries its position.
function mapProjectCandidates(users: ProjectUserApiItem[] = []) {
  return users.map(
    (user, index): ProjectCandidate => ({
      id: `${user.id}-${index}`,
      name: user.name,
      email: user.email,
      phone: [user.phone_code, user.phone].filter(Boolean).join(' '),
      nationality: MISSING_API_VALUE,
      cv: user.cv,
      image: user.image,
    }),
  );
}

export async function getProject(
  projectId: string,
  { token, locale }: ProjectRequestOptions,
): Promise<ProjectDetails> {
  const { ok, data, message, statusCode } = await apiFetch<ProjectApiItem>(
    `${getCompanyApiUrl()}/projects/${encodeURIComponent(projectId)}`,
    { token, locale, cache: 'no-store' },
  );
  if (!ok || !data?.data) {
    throw createHttpStatusError(statusCode, message ?? undefined);
  }
  return {
    ...mapProject(data.data),
    candidates: mapProjectCandidates(data.data.users),
  };
}

export async function renameProject(
  projectId: string,
  name: string,
  { token, locale }: ProjectRequestOptions,
) {
  const body = new FormData();
  body.append('name', name.trim());
  body.append('_method', 'put');
  const { ok, message } = await apiFetch(
    `${getCompanyApiUrl()}/projects/${encodeURIComponent(projectId)}`,
    { method: 'POST', token, locale, body },
  );
  if (!ok) throw new Error(message ?? '');
}

export async function deleteProject(
  projectId: string,
  { token, locale }: ProjectRequestOptions,
) {
  const { ok, message } = await apiFetch(
    `${getCompanyApiUrl()}/projects/${encodeURIComponent(projectId)}`,
    { method: 'DELETE', token, locale },
  );
  if (!ok) throw new Error(message ?? '');
}

export async function createProject(
  name: string,
  { token, locale }: ProjectRequestOptions,
): Promise<string> {
  const body = new FormData();
  body.append('name', name.trim());
  const { ok, data, message } = await apiFetch<ProjectApiItem>(
    `${getCompanyApiUrl()}/projects`,
    { method: 'POST', token, locale, body },
  );
  if (!ok || !data?.data) throw new Error(message ?? '');
  return String(data.data.id);
}

// Projects for the "Add to project" picker (`projects-list`: id + name).
// Candidate counts have no API yet.
export async function getProjectOptions(
  search: string,
  page: number,
  limitPerPage: number,
  { token, locale }: ProjectRequestOptions,
): Promise<ProjectOptionsPage> {
  const params = new URLSearchParams({
    pagination: 'on',
    limit_per_page: String(limitPerPage),
    page: String(page),
  });
  if (search.trim()) params.set('search', search.trim());
  const { ok, data, message } = await apiFetch<
    Pick<ProjectApiItem, 'id' | 'name'>[]
  >(`${getCompanyApiUrl()}/projects-list?${params.toString()}`, {
    token,
    locale,
    cache: 'no-store',
  });
  if (!ok) throw new Error(message ?? '');
  const meta = readPaginationMeta(data, limitPerPage);
  return {
    data: (data?.data ?? []).map((project) => ({
      id: String(project.id),
      name: project.name,
      candidateCount: null,
    })),
    // useInfiniteLookup reads the next page from a full URL.
    next_page_url: meta.nextPage
      ? `${getCompanyApiUrl()}/projects-list?page=${meta.nextPage}`
      : null,
  };
}

// Adds candidates (user ids) to one or more projects.
export async function assignCandidatesToProjects(
  userIds: string[],
  projectIds: string[],
  { token, locale }: ProjectRequestOptions,
) {
  const body = new FormData();
  [...new Set(userIds)].forEach((id) => body.append('assignee_ids[]', id));
  [...new Set(projectIds)].forEach((id) => body.append('projects_ids[]', id));
  const { ok, message } = await apiFetch(
    `${getCompanyApiUrl()}/projects/assign-to-users`,
    { method: 'POST', token, locale, body },
  );
  if (!ok) throw new Error(message ?? '');
}

export async function getHiringManagers({
  token,
  locale,
}: ProjectRequestOptions): Promise<HiringManagerOption[]> {
  const { ok, data, message } = await apiFetch<HiringManagerApiItem[]>(
    `${getCompanyApiUrl()}/hiring-managers-list`,
    { token, locale, cache: 'no-store' },
  );
  if (!ok) throw new Error(message ?? '');
  return (data?.data ?? []).map((manager) => ({
    id: String(manager.id),
    name: manager.name,
  }));
}

// Shares the project with a hiring manager; `note` is the message they receive.
export async function shareProjectWithHiringManager(
  projectId: string,
  assigneeId: string,
  note: string,
  { token, locale }: ProjectRequestOptions,
) {
  const body = new FormData();
  body.append('assignee_id', assigneeId);
  body.append('note', note.trim());
  const { ok, message } = await apiFetch(
    `${getCompanyApiUrl()}/projects/${encodeURIComponent(projectId)}/assign-to-hiring-manager`,
    { method: 'POST', token, locale, body },
  );
  if (!ok) throw new Error(message ?? '');
}
