import type { ProfileViewer } from '../types/profile-insights.types';

// Design preview data until the "who viewed your profile" API is ready (mock data, not translated).
// Apart from Saudi German Hospital (the Figma example), these are real Joocare companies, so
// "View Profile" opens an existing page.
const PREVIEW_COMPANIES: Omit<ProfileViewer, 'id' | 'viewedAt'>[] = [
  {
    companyId: 1,
    companyName: 'Saudi German Hospital',
    companyType: 'Hospital',
    logo: '/assets/profile-insights/saudi-german-hospital.png',
  },
  {
    companyId: 88,
    companyName: 'Global Medical Solutions',
    companyType: 'Healthcare Workforce Solutions',
    logo: 'https://admin.joocare.com/storage/images/KJrEPfDiaMVMIrN1e2SIYTBk69StTIvUGbp4qVnj.jpg',
  },
  {
    companyId: 133,
    companyName: 'Emirates International Hospital',
    companyType: 'Hospital',
    logo: 'https://admin.joocare.com/storage/images/8SsmpmZxPVFUyoB52OalzXOxhiqwZxLUx9Pednqx.jpg',
  },
  {
    companyId: 130,
    companyName: 'ZIA Medical Center',
    companyType: 'Medical Center',
    logo: 'https://admin.joocare.com/storage/uploads/companies/images/6a9fca499e6e51788856905.webp',
  },
  {
    companyId: 105,
    companyName: 'Global Medical City',
    companyType: 'Hospital',
    logo: 'https://admin.joocare.com/storage/uploads/companies/images/6a09ed35c3edf1779035445.webp',
  },
  {
    companyId: 124,
    companyName: 'HMS Group',
    companyType: 'Healthcare Group',
    logo: 'https://admin.joocare.com/storage/images/MbsRdvAoHsAP8Xivz1xGrE2jNLGBidnW6aoWbFgp.png',
  },
  {
    companyId: 112,
    companyName: 'International Modern Hospital',
    companyType: 'Hospital',
    logo: 'https://admin.joocare.com/storage/uploads/companies/images/6a3822e8709861782063848.webp',
  },
];

const PREVIEW_VIEWERS_COUNT = 11;
const LATEST_VIEW = Date.UTC(2025, 11, 25);
const DAY_MS = 24 * 60 * 60 * 1000;

// Newest first, one visit every couple of days.
export const PROFILE_VIEWERS_PREVIEW: ProfileViewer[] = Array.from(
  { length: PREVIEW_VIEWERS_COUNT },
  (_, index) => ({
    ...PREVIEW_COMPANIES[index % PREVIEW_COMPANIES.length],
    id: `viewer-${index + 1}`,
    viewedAt: new Date(LATEST_VIEW - index * 2 * DAY_MS).toISOString(),
  }),
);
