import type {
  CompanyDashboardApi,
  CompanyJob,
  DashboardHiringAlert,
  DashboardRecruiter,
} from '../index.type';

export const DASHBOARD_DESIGN_PERIOD = '2026-09';
export const DASHBOARD_FILL_LIMIT = 30;
export const DASHBOARD_FILL_SCALE_MAX = 45;

// Figma fixture values for UI review. These are not calculated business metrics.
export const dashboardDesignStats: CompanyDashboardApi = {
  active_jobs: 12,
  total_applications: 327,
  applications_latest_activity: 12,
  cvs_downloaded: 320,
  categories_percentage: [
    { category_title: 'Nursing', percentage: 25 },
    { category_title: 'Physicians', percentage: 25 },
    { category_title: 'Allied Health', percentage: 50 },
  ],
};

export const dashboardDesignJobs: CompanyJob[] = [12, 24, 40, 40].map(
  (views, index) => ({
    id: index + 1,
    title: 'Consultant Internist',
    job_title_id: 1,
    job_title: { id: 1, title: 'Consultant Internist' },
    applications_count: index === 0 ? 3 : index === 1 ? 4 : 5,
    views_num: views,
    created_at: '2026-12-21T00:00:00Z',
  }),
);

export const dashboardHiringAlerts: DashboardHiringAlert[] = [
  {
    id: 'senior-neurosurgeon',
    title: 'Senior Neurosurgeon',
    company: 'St. Jude Medical',
    publishedAt: '2026-08-12',
    openDays: 42,
    href: '/company/job-management',
  },
  {
    id: 'clinical-pharmacist',
    title: 'Clinical Pharmacist',
    company: 'Outpatient Pharmacy',
    publishedAt: '2026-08-21',
    openDays: 33,
    href: '/company/job-management',
  },
  {
    id: 'lead-icu-nurse',
    title: 'Lead ICU Nurse',
    company: 'City General',
    publishedAt: '2026-08-22',
    openDays: 32,
    href: '/company/job-management',
  },
];

export const dashboardRecruiters: DashboardRecruiter[] = [
  { id: 'sara', name: 'Sara Al-Qahtani', jobsPosted: 38 },
  { id: 'omar', name: 'Omar Haddad', jobsPosted: 33 },
  { id: 'nour', name: 'Nour El-Sayed', jobsPosted: 31 },
  { id: 'fahad', name: 'Fahad Al-Harbi', jobsPosted: 27 },
  { id: 'mona', name: 'Mona Abdelrahman', jobsPosted: 24 },
  { id: 'khalid', name: 'Khalid Al-Mutairi', jobsPosted: 19 },
  { id: 'rania', name: 'Rania Youssef', jobsPosted: 15 },
  { id: 'ahmed', name: 'Ahmed Mohamed', jobsPosted: 11 },
];

export const dashboardDesignAnalytics = {
  timeToFill: 14,
  brandReach: 5200,
  brandReachChange: 12.5,
  talentIntakeChange: 8.4,
  totalApplicationChange: 12,
  alertCount: 5,
  recruiterCount: 24,
};
export const DASHBOARD_CATEGORY_COLORS = [
  'var(--dashboard-category-blue)',
  'var(--dashboard-category-green)',
  'var(--dashboard-category-orange)',
  'var(--avatar-teal)',
  'var(--avatar-slate)',
];
