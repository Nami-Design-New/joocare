import type {
  CompanyDashboard,
  CompanyJob,
  DashboardAdminJobs,
  DashboardMonthFilter,
  DashboardPage,
} from '../index.type';

export const DASHBOARD_DESIGN_PERIOD = '2026-09';

const designMonth: DashboardMonthFilter = {
  filter_month: DASHBOARD_DESIGN_PERIOD,
  filter_month_label: 'Sep 2026',
  previous_month_label: 'Aug 2026',
};

// Figma fixture values for UI review (`?preview=design`). These are not calculated business metrics.
export const dashboardDesignStats: CompanyDashboard = {
  active_jobs: 12,
  recent_activity: {
    count_today: 12,
    last_activity_at: '22 Sep 2026, 10:15 AM',
  },
  total_applications: {
    ...designMonth,
    value: 327,
    previous: 292,
    growth_rate: 12,
  },
  job_duration: {
    ...designMonth,
    average_hours: 336,
    average_days: 14,
    closed_jobs_count: 6,
  },
  cv_downloads: { ...designMonth, value: 320, previous: 295, growth_rate: 8.4 },
  user_visits: {
    ...designMonth,
    value: 5200,
    previous: 4622,
    growth_rate: 12.5,
  },
  stale_jobs: {
    total: 5,
    has_more: true,
    jobs: [
      {
        id: 1,
        title: 'Senior Neurosurgeon',
        specialty: 'Neurosurgery',
        opened_at: '12 Aug 2026',
        days_open: 42,
      },
      {
        id: 2,
        title: 'Clinical Pharmacist',
        specialty: 'Pharmacy',
        opened_at: '21 Aug 2026',
        days_open: 33,
      },
      {
        id: 3,
        title: 'Lead ICU Nurse',
        specialty: 'Nursing',
        opened_at: '22 Aug 2026',
        days_open: 32,
      },
    ].map((job) => ({ ...job, specialty_id: null })),
  },
  categories_percentage: [
    { category_id: 1, category_title: 'Nursing', count: 1, percentage: 25 },
    { category_id: 2, category_title: 'Physicians', count: 1, percentage: 25 },
    {
      category_id: 3,
      category_title: 'Allied Health',
      count: 2,
      percentage: 50,
    },
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
    created_at: '21 December 2026',
  }),
);

export const dashboardDesignRecruiters: DashboardPage<DashboardAdminJobs> = {
  currentPage: 1,
  perPage: 8,
  total: 24,
  data: [
    ['Sara Al-Qahtani', 38],
    ['Omar Haddad', 33],
    ['Nour El-Sayed', 31],
    ['Fahad Al-Harbi', 27],
    ['Mona Abdelrahman', 24],
    ['Khalid Al-Mutairi', 19],
    ['Rania Youssef', 15],
    ['Ahmed Mohamed', 11],
  ].map(([admin_name, jobs_count], index) => ({
    admin_id: index + 1,
    admin_name: String(admin_name),
    jobs_count: Number(jobs_count),
  })),
};
