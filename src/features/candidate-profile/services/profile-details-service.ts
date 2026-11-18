import 'server-only';
import { getLocale } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import type {
  ProfileDetails,
  ProfileDetailsLookup,
} from '@/features/candidate-additional-info/types/profile-details.types';
import { getUserApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch } from '@/shared/lib/fetch-manager';
import type { CandidatePersonalDetails } from '../types/profile.types';

const EMPTY_DETAILS: CandidatePersonalDetails = {
  domain: null,
  gender: null,
  maritalStatus: null,
  religion: null,
  languages: [],
  drivingLicense: null,
  licenseCountries: [],
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

// Fixed choices come back as `{ value, label }`.
function toLabel(value: unknown): string | null {
  return isRecord(value) && typeof value.label === 'string'
    ? value.label
    : null;
}

const toNames = (items: ProfileDetailsLookup[] | undefined) =>
  (items ?? []).flatMap((item) => item.name ?? item.title ?? []);

function toBoolean(value: unknown): boolean | null {
  if (value === null || value === undefined || value === '') return null;
  return value === true || value === 1 || value === '1';
}

// Personal rows of the profile side panel, saved from the Additional info tab.
export async function getCandidatePersonalDetails(): Promise<CandidatePersonalDetails> {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken || session.authRole !== 'candidate') {
    return EMPTY_DETAILS;
  }

  const locale = await getLocale();
  const { ok, data } = await apiFetch<ProfileDetails>(
    `${getUserApiUrl()}/profile-details`,
    {
      method: 'GET',
      locale,
      token: String(session.accessToken),
      cache: 'no-store',
    },
  );

  const details = data?.data;

  if (!ok || !details) {
    return EMPTY_DETAILS;
  }

  const domain = details.occupational?.domain;
  const religion = details.personal_details?.religion;

  return {
    domain: domain?.title ?? domain?.name ?? null,
    gender: toLabel(details.personal_details?.gender),
    maritalStatus: toLabel(details.personal_details?.marital_status),
    religion: religion?.title ?? religion?.name ?? null,
    languages: (details.languages ?? []).flatMap(
      (item) => (isRecord(item) && toLabel(item.language)) || [],
    ),
    drivingLicense: toBoolean(details.mobility?.has_driving_license),
    licenseCountries: toNames(details.mobility?.driving_license_countries),
  };
}
