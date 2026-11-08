import type { AtsMatchResult } from '../types/cv-match-ats.types';

// Design-only analysis result until the ATS API is ready (not translated).
export const ATS_PREVIEW_RESULT: AtsMatchResult = {
  fileName: 'saeedCv.pdf',
  score: 85,
  points: [
    {
      title: 'Medical Keywords (ATS Keywords)',
      text: 'Add specialised skills such as (ICU, BLS, ACLS) to ensure your profile appears at the top of hospital search results.',
    },
    {
      title: 'Licensing Verification',
      text: 'Make sure to attach the number and expiry date of the Health Specialties Authority licence; verified profiles have a 40% higher chance of being hired.',
    },
    {
      title: 'Title Accuracy',
      text: 'Use an accurate job title (e.g. Intensive Care Nursing Specialist) instead of general titles to facilitate smart matching.',
    },
    {
      title: 'Clinical Impact',
      text: 'Focus on writing your achievements with numbers (e.g. managing 10 patients daily) to give a stronger impression of your clinical experience.',
    },
    {
      title: 'File Compatibility',
      text: 'Avoid using complex tables or images within the CV to ensure it is correctly read by automated filtering systems.',
    },
  ],
};
