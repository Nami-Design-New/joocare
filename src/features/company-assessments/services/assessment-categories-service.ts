import { getCompanyApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch } from '@/shared/lib/fetch-manager';
import type {
  AssessmentCategory,
  AssessmentCategoryApiItem,
  AssessmentCategoryOption,
  AssessmentCategoryOptionApiItem,
  AssessmentSource,
  CategoryFormValues,
  PaginatedResult,
} from '../types/assessment.types';
import { buildListParams, readPaginationMeta } from '../utils/pagination';

type RequestOptions = { token: string; locale: string };

const CATEGORY_LIST_ENDPOINTS: Record<AssessmentSource, string> = {
  joocare: 'global-assessment-categories',
  company: 'assessment-categories',
};

function mapCategory(
  item: AssessmentCategoryApiItem,
  source: AssessmentSource,
): AssessmentCategory {
  return {
    id: String(item.id),
    source,
    name: item.name,
    description: item.description ?? '',
    assessmentCount: item.assessments_count ?? 0,
  };
}

export async function getAssessmentCategories(
  source: AssessmentSource,
  page: number,
  limitPerPage: number,
  { token, locale }: RequestOptions,
): Promise<PaginatedResult<AssessmentCategory>> {
  const { ok, data, message } = await apiFetch<AssessmentCategoryApiItem[]>(
    `${getCompanyApiUrl()}/${CATEGORY_LIST_ENDPOINTS[source]}?${buildListParams(page, limitPerPage)}`,
    { token, locale },
  );
  if (!ok) throw new Error(message ?? '');
  return {
    items: (data?.data ?? []).map((item) => mapCategory(item, source)),
    meta: readPaginationMeta(data, limitPerPage),
  };
}

export async function getAssessmentCategoryOptions(
  search: string,
  page: number,
  limitPerPage: number,
  { token, locale }: RequestOptions,
): Promise<PaginatedResult<AssessmentCategoryOption>> {
  const { ok, data, message } = await apiFetch<
    AssessmentCategoryOptionApiItem[]
  >(
    `${getCompanyApiUrl()}/all-assessment-categories?${buildListParams(page, limitPerPage, { search })}`,
    { token, locale },
  );
  if (!ok) throw new Error(message ?? '');
  return {
    items: (data?.data ?? []).map((item) => ({
      id: String(item.id),
      source: item.is_global ? 'joocare' : 'company',
      name: item.name,
      libraryLabel: item.library_label,
    })),
    meta: readPaginationMeta(data, limitPerPage),
  };
}

export async function getAssessmentCategory(
  categoryId: string,
  source: AssessmentSource,
  { token, locale }: RequestOptions,
): Promise<AssessmentCategory> {
  const { ok, data, message } = await apiFetch<AssessmentCategoryApiItem>(
    `${getCompanyApiUrl()}/assessment-categories/${categoryId}`,
    { token, locale },
  );
  if (!ok || !data?.data) throw new Error(message ?? '');
  return mapCategory(data.data, source);
}

export async function saveAssessmentCategory(
  categoryId: string | null,
  values: CategoryFormValues,
  { token, locale }: RequestOptions,
) {
  const body = new FormData();
  body.append('name', values.name.trim());
  body.append('description', values.description.trim());
  if (categoryId) body.append('_method', 'put');

  const { ok, message } = await apiFetch(
    `${getCompanyApiUrl()}/assessment-categories${categoryId ? `/${categoryId}` : ''}`,
    { method: 'POST', token, locale, body },
  );
  if (!ok) throw new Error(message ?? '');
}

export async function deleteAssessmentCategory(
  categoryId: string,
  { token, locale }: RequestOptions,
) {
  const { ok, message } = await apiFetch(
    `${getCompanyApiUrl()}/assessment-categories/${categoryId}`,
    { method: 'DELETE', token, locale, body: new FormData() },
  );
  if (!ok) throw new Error(message ?? '');
}
