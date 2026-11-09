import 'server-only';
import { getLocale } from 'next-intl/server';
import { getBaseApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch } from '@/shared/lib/fetch-manager';
import type {
  CandidateProfessionalProfile,
  CandidateProfileViewModel,
} from '../types/profile.types';

type TaxonomyItem = { id: number; title: string };
type TaxonomyResource = 'domains' | 'categories';

// Public lookups: safe to cache (the profile API only returns their ids).
const TAXONOMY_REVALIDATE = 300;

async function getTaxonomyTitle(
  resource: TaxonomyResource,
  id: string | null | undefined,
  locale: string,
) {
  if (!id) return null;
  const { ok, data } = await apiFetch<TaxonomyItem[]>(
    `${getBaseApiUrl()}/${resource}`,
    {
      method: 'GET',
      locale,
      cache: 'force-cache',
      next: { revalidate: TAXONOMY_REVALIDATE },
    },
  );
  if (!ok || !Array.isArray(data?.data)) return null;
  return data.data.find((item) => String(item.id) === id)?.title.trim() ?? null;
}

// Specialty / domain / category rows of the profile home side panel.
export async function getProfessionalProfile(
  profile: CandidateProfileViewModel | null,
): Promise<CandidateProfessionalProfile> {
  const locale = await getLocale();
  const [domain, category] = await Promise.all([
    getTaxonomyTitle('domains', profile?.domainId, locale),
    getTaxonomyTitle('categories', profile?.categoryId, locale),
  ]);

  return {
    specialty: profile?.specialty_title ?? null,
    subspecialty: profile?.subspecialtyTitle ?? null,
    domain,
    category,
  };
}
