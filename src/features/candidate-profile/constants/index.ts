import { Settings } from 'lucide-react';
import type { SidebarLinkItem } from '@/shared/types/sidebar-link.types';

export const CANDIDATE_ROUTES = {
  profile: '/candidate/profile',
  applications: '/candidate/applications',
  credentials: '/candidate/credentials',
  qualifications: '/candidate/credentials/qualifications',
  cvMatchAts: '/candidate/cv-match-ats',
  buildCv: '/candidate/build-cv',
  aiJobMatch: '/candidate/ai-job-match',
  profileInsights: '/candidate/profile-insights',
  settings: '/candidate/settings',
  basicInfo: '/candidate/settings/basic-info',
  chat: '/candidate/chat',
} as const;

// Breadcrumb title per candidate section (keys under `candidatePage`), matched by path prefix.
export const CANDIDATE_PAGE_TITLES: readonly { path: string; label: string }[] =
  [
    { path: CANDIDATE_ROUTES.profile, label: 'sidebar.my-profile' },
    { path: CANDIDATE_ROUTES.applications, label: 'sidebar.job-applications' },
    {
      path: CANDIDATE_ROUTES.credentials,
      label: 'sidebar.professional-credentials',
    },
    { path: CANDIDATE_ROUTES.cvMatchAts, label: 'sidebar.cv-match-ats' },
    { path: CANDIDATE_ROUTES.buildCv, label: 'sidebar.build-cv' },
    { path: CANDIDATE_ROUTES.aiJobMatch, label: 'sidebar.ai-job-match' },
    {
      path: CANDIDATE_ROUTES.profileInsights,
      label: 'sidebar.profile-insights',
    },
    { path: CANDIDATE_ROUTES.settings, label: 'sidebar.profile-settings' },
    { path: CANDIDATE_ROUTES.chat, label: 'chat.title' },
  ];

export const CANDIDATE_SIDEBAR_LINKS: readonly SidebarLinkItem[] = [
  {
    label: 'my-profile',
    href: CANDIDATE_ROUTES.profile,
    image: '/assets/icons/profile.svg',
  },
  {
    label: 'job-applications',
    href: CANDIDATE_ROUTES.applications,
    image: '/assets/icons/application.svg',
  },
  {
    label: 'professional-credentials',
    href: CANDIDATE_ROUTES.qualifications,
    activePaths: [CANDIDATE_ROUTES.credentials],
    image: '/assets/icons/professional_credentials.svg',
  },
  {
    label: 'cv-match-ats',
    href: CANDIDATE_ROUTES.cvMatchAts,
    image: '/assets/icons/cv-match-ats.svg',
  },
  {
    label: 'build-cv',
    href: CANDIDATE_ROUTES.buildCv,
    image: '/assets/icons/build-cv.svg',
  },
  {
    label: 'ai-job-match',
    href: CANDIDATE_ROUTES.aiJobMatch,
    image: '/assets/icons/ai-job-match.svg',
  },
];

export const CANDIDATE_SIDEBAR_BOTTOM_LINKS: readonly SidebarLinkItem[] = [
  {
    label: 'profile-insights',
    href: CANDIDATE_ROUTES.profileInsights,
    image: '/assets/icons/profile-insights.svg',
  },
  {
    label: 'profile-settings',
    href: CANDIDATE_ROUTES.basicInfo,
    activePaths: [CANDIDATE_ROUTES.settings],
    icon: Settings,
  },
];
