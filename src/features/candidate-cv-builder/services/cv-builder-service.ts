import { getUserApiUrl } from '@/shared/lib/api-endpoints';
import { apiFetch } from '@/shared/lib/fetch-manager';
import type { CvStepOnePayload } from '../types/cv-builder.types';
import type {
  CvBuilderRemoteData,
  CvSuggestedSkill,
} from '../types/cv-builder.types';
import { CV_BUILDER_STEPS } from '../constants';
import { mapCvBuilderRemoteData } from '../utils/cv-builder-response';

type SaveCvStepOneOptions = {
  locale: string;
  token: string;
  payload: CvStepOnePayload;
};

type GetCvBuilderOptions = {
  locale: string;
  token: string;
};

export async function getCvBuilderService({
  locale,
  token,
}: GetCvBuilderOptions): Promise<CvBuilderRemoteData> {
  const cvUrl = `${getUserApiUrl()}/cv`;
  const cvResult = await apiFetch<unknown>(cvUrl, {
    method: 'GET',
    locale,
    token,
  });

  if (cvResult.statusCode === 404) {
    return mapCvBuilderRemoteData(null, null, CV_BUILDER_STEPS.length, locale);
  }

  if (!cvResult.ok) {
    throw new Error();
  }

  const progressResult = await apiFetch<unknown>(
    `${getUserApiUrl()}/cv/progress`,
    { method: 'GET', locale, token },
  );

  if (!progressResult.ok && progressResult.statusCode !== 404) {
    throw new Error();
  }

  return mapCvBuilderRemoteData(
    cvResult.data,
    progressResult.ok ? progressResult.data : null,
    CV_BUILDER_STEPS.length,
    locale,
  );
}

export const getCvBuilderLandingService = getCvBuilderService;

export async function getSuggestedCvSkillsService({
  locale,
  token,
}: GetCvBuilderOptions): Promise<CvSuggestedSkill[]> {
  const { ok, data } = await apiFetch<unknown>(
    `${getUserApiUrl()}/suggested/user-skills`,
    { method: 'GET', locale, token },
  );
  if (!ok) throw new Error();

  const root =
    data && typeof data === 'object' && !Array.isArray(data)
      ? (data as Record<string, unknown>)
      : null;
  const body =
    root?.data && typeof root.data === 'object' && !Array.isArray(root.data)
      ? (root.data as Record<string, unknown>)
      : root;
  const suggested = body?.suggested;
  if (!Array.isArray(suggested)) return [];

  return suggested.flatMap((item): CvSuggestedSkill[] => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return [];
    const skill = item as Record<string, unknown>;
    const id = skill.id;
    const label = skill.title ?? skill.name;
    const numericId = Number(id);
    return Number.isInteger(numericId) &&
      numericId > 0 &&
      typeof label === 'string' &&
      label.trim()
      ? [{ id: String(numericId), label }]
      : [];
  });
}

export async function saveCvBuilderStepOneService({
  locale,
  token,
  payload,
}: SaveCvStepOneOptions) {
  const { ok, data, message } = await apiFetch<unknown>(
    `${getUserApiUrl()}/cv/step-one`,
    {
      method: 'POST',
      locale,
      token,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
  );

  if (!ok) {
    throw new Error(message || undefined);
  }

  return data;
}

export async function saveCvBuilderStepService({
  locale,
  token,
  step,
  payload,
}: {
  locale: string;
  token: string;
  step: number;
  payload: unknown;
}) {
  const names = [
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
  ];
  const stepName = names[step - 1];
  const { ok, data, message } = await apiFetch<unknown>(
    `${getUserApiUrl()}/cv/step-${stepName}`,
    {
      method: 'POST',
      locale,
      token,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
  );
  if (!ok) throw new Error(message || undefined);
  return data;
}

// Stores the CV file path on the completed CV (used by job applications).
export async function uploadCvBuilderCvService({
  locale,
  token,
  cvPath,
}: {
  locale: string;
  token: string;
  cvPath: string;
}) {
  const { ok, data, message } = await apiFetch<unknown>(
    `${getUserApiUrl()}/cv/upload-cv`,
    {
      method: 'POST',
      locale,
      token,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cv: cvPath }),
    },
  );
  if (!ok) throw new Error(message || undefined);
  return data;
}

// Clears/deletes the CV draft.
export async function deleteCvDraftService({
  locale,
  token,
}: {
  locale: string;
  token: string;
}) {
  const { ok, data, message } = await apiFetch<unknown>(
    `${getUserApiUrl()}/cv/delete-cv`,
    {
      method: 'DELETE',
      locale,
      token,
    },
  );
  if (!ok) throw new Error(message || undefined);
  return data;
}
