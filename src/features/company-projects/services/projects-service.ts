import { readPaginationMeta } from '@/features/company-assessments/utils/pagination';
import { getCompanyApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch } from '@/shared/lib/fetch-manager';
import { createHttpStatusError } from '@/shared/lib/http-error';
import type {
  CompanyProject,
  ProjectApiItem,
  ProjectRequestOptions,
  ProjectsListPage,
} from '../types/company-projects.types';

// Candidates, recruiter, closing and sharing have no API yet: they start empty
// and the UI keeps its preview behaviour for them.
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
    shareLogs: [],
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

export async function getProject(
  projectId: string,
  { token, locale }: ProjectRequestOptions,
): Promise<CompanyProject> {
  const { ok, data, message, statusCode } = await apiFetch<ProjectApiItem>(
    `${getCompanyApiUrl()}/projects/${encodeURIComponent(projectId)}`,
    { token, locale, cache: 'no-store' },
  );
  if (!ok || !data?.data) {
    throw createHttpStatusError(statusCode, message ?? undefined);
  }
  return mapProject(data.data);
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
