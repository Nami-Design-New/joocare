// Card icons exported from Figma (public/assets/icons/ai-job-match).
const ICONS_PATH = '/assets/icons/ai-job-match';

export const JOB_MATCH_META_ICONS = {
  location: `${ICONS_PATH}/location.svg`,
  salary: `${ICONS_PATH}/salary.svg`,
  jobType: `${ICONS_PATH}/job-type.svg`,
} as const;

// Icons tinted by the match level are drawn as a mask, so one file works with any `text-*` color.
const MASK_ICON =
  'inline-block shrink-0 bg-current mask-contain mask-center mask-no-repeat';

export const SPARKLES_MASK_ICON = `${MASK_ICON} mask-[url(/assets/icons/ai-job-match/sparkles.svg)]`;
export const CHECK_CIRCLE_MASK_ICON = `${MASK_ICON} mask-[url(/assets/icons/ai-job-match/check-circle.svg)]`;
