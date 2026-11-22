import { ASSESSMENT_ASSETS } from '../constants/assessment-invitations';

const DEFAULT_CANDIDATE_IMAGE = '/assets/profile_image.svg';

// The results API sends UTC times as "YYYY-MM-DD HH:mm:ss" without a zone.
export function toUtcIsoDate(value: string | null | undefined) {
  if (!value) return null;
  const iso = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/.test(value)
    ? `${value.replace(' ', 'T')}Z`
    : value;
  return Number.isNaN(new Date(iso).getTime()) ? null : iso;
}

// API images are absolute URLs; preview rows use local asset file names.
export function getCandidateImageSrc(image: string | null) {
  if (!image) return DEFAULT_CANDIDATE_IMAGE;
  return /^https?:\/\//.test(image) ? image : `${ASSESSMENT_ASSETS}/${image}`;
}
