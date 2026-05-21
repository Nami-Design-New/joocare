import type { Metadata } from 'next';

import type { PopularSearchesItem } from '@/features/home/components/PopularSearches';
import { getPopularSearchesPage } from '@/features/home/services/home-service';
import type {
  AccordionSection,
  FilterState,
} from '@/features/jobs/types/index.types';
import JobsFilterSection from '@/features/jobs/components/candidate/JobsFilterSection';
import JobsList from '@/features/jobs/components/candidate/JobsList';
import JobsSideBarFilter from '@/features/jobs/components/candidate/JobsSideBarFilter';
import MobileFilterDrawer from '@/features/jobs/components/candidate/MobileFilterDrawer';
import {
  getJobsFiltersData,
  getJobsListing,
} from '@/features/jobs/services/jobs-listing-service';
import {
  buildJobsPagePath,
  getSiteOrigin,
  normalizeJobsSearchParams,
} from '@/features/jobs/utils';
import Breadcrumb from '@/shared/components/Breadcrumb';
import { getTranslations } from 'next-intl/server';
import GpuFixClient from '@/shared/components/GpuFixClient';
type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getPageCopy(locale: string, search: string) {
  if (locale === 'ar') {
    return {
      title: search
        ? `وظائف ${search} في القطاع الصحي`
        : 'وظائف الرعاية الصحية',
      description:
        'اكتشف فرص العمل الطبية والصحية على جـوكير مع تصفية حسب الدولة، المجال، الخبرة، ونوع التوظيف للوصول إلى الوظيفة المناسبة بسرعة.',
    };
  }

  return {
    title: search ? `${search} Jobs in Healthcare` : 'Healthcare Jobs',
    description:
      'Browse healthcare jobs on Joocare with country, salary, seniority, specialty, and employment filters designed for medical professionals.',
  };
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const normalizedParams = normalizeJobsSearchParams(await searchParams);
  const copy = getPageCopy(locale, normalizedParams.search);
  const siteOrigin = getSiteOrigin();
  const canonicalPath = buildJobsPagePath(locale, normalizedParams);
  const shareLinkImage = `${siteOrigin}/logo-icon.jfif`;

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: `${siteOrigin}${canonicalPath}`,
      languages: {
        en: `${siteOrigin}/en/jobs`,
        ar: `${siteOrigin}/ar/jobs`,
      },
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: `${siteOrigin}${canonicalPath}`,
      type: 'website',
      siteName: 'Joocare',
      images: [
        {
          url: shareLinkImage,
          alt: 'Joocare',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.title,
      description: copy.description,
      images: [shareLinkImage],
    },
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const normalizedParams = normalizeJobsSearchParams(await searchParams);
  const actionPath = `/jobs`;
  const copy = getPageCopy(locale, normalizedParams.search);
  const t = await getTranslations();
  const [filtersData, jobsData, popularSearchesPage] = await Promise.all([
    getJobsFiltersData(locale, normalizedParams.roleCategories),
    getJobsListing(locale, normalizedParams),
    getPopularSearchesPage({ locale }),
  ]);

  const filterState: FilterState = {
    professionalLicense: normalizedParams.professionalLicenses,
    roleCategories: normalizedParams.roleCategories,
    seniorityLevels: normalizedParams.seniorityLevels,
    domains: normalizedParams.domains,
    // specialties: normalizedParams.specialties,
    experiences: normalizedParams.experiences,
    availabilities: normalizedParams.availabilities,
    categories: normalizedParams.categories,
    employmentTypes: normalizedParams.employmentTypes,
    salaryTypes: normalizedParams.salaryTypes,
    salaryMin: normalizedParams.minSalary,
    salaryMax: normalizedParams.maxSalary,
  };

  const filterSections: AccordionSection[] = [
    {
      key: 'professionalLicense',
      label: t('jobsPage.filters.professional-license'),
      name: 'professional_licenses[]',
      options: [
        { value: 'with_medical_license', label: t('jobsPage.filters.with-medical-license') },
        { value: 'without_medical_license', label: t('jobsPage.filters.without-medical-license') },
      ],
    },
    {
      key: 'roleCategories',
      label: t('jobsPage.filters.role-category'),
      name: 'role_categories[]',
      options: filtersData.roleCategories,
    },
    {
      key: 'seniorityLevels',
      label: t('jobsPage.filters.seniority-level'),
      name: 'seniority_levels[]',
      options: filtersData.seniorityLevels,
    },
    {
      key: 'domains',
      label: t('jobsPage.filters.domain'),
      name: 'domains[]',
      options: filtersData.domains,
    },
    // {
    //   key: "specialties",
    //   label: "Specialty",
    //   name: "specialties[]",
    //   options: filtersData.specialties,
    // },
    {
      key: 'experiences',
      label: t('jobsPage.filters.experience'),
      name: 'experiences[]',
      options: filtersData.experiences,
    },
    {
      key: 'availabilities',
      label: t('jobsPage.filters.availability'),
      name: 'availabilities[]',
      options: filtersData.availabilities,
    },
    {
      key: 'categories',
      label: t('jobsPage.filters.category'),
      name: 'categories[]',
      options: filtersData.categories,
    },
    {
      key: 'employmentTypes',
      label: t('jobsPage.filters.employment-type'),
      name: 'employment_types[]',
      options: filtersData.employmentTypes,
    },
  ];

  const hiddenInputs = [
    ...normalizedParams.roleCategories.map((value) => ({
      name: 'role_categories[]',
      value,
    })),
    ...normalizedParams.seniorityLevels.map((value) => ({
      name: 'seniority_levels[]',
      value,
    })),
    // ...normalizedParams.specialties.map((value) => ({ name: "specialties[]", value })),
    ...normalizedParams.experiences.map((value) => ({
      name: 'experiences[]',
      value,
    })),
    ...normalizedParams.availabilities.map((value) => ({
      name: 'availabilities[]',
      value,
    })),
    ...normalizedParams.salaryTypes.map((value) => ({
      name: 'salary_types[]',
      value,
    })),
    ...normalizedParams.categories.map((value) => ({
      name: 'categories[]',
      value,
    })),
    ...normalizedParams.employmentTypes.map((value) => ({
      name: 'employment_types[]',
      value,
    })),
    ...normalizedParams.professionalLicenses.map((value) => ({
      name: 'professional_licenses[]',
      value,
    })),
    ...normalizedParams.domains.map((value) => ({
      name: 'domains[]',
      value,
    })),
    ...(normalizedParams.minSalary
      ? [{ name: 'min_salary', value: normalizedParams.minSalary }]
      : []),
    ...(normalizedParams.maxSalary
      ? [{ name: 'max_salary', value: normalizedParams.maxSalary }]
      : []),
  ];

  const popularSearches: PopularSearchesItem[] = popularSearchesPage.items.map(
    (item) => ({
      id: item.id,
      label: item.label,
    }),
  );

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: t('header.home'),
            item: `${getSiteOrigin()}/${locale}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: t('header.jobs'),
            item: `${getSiteOrigin()}${buildJobsPagePath(locale, normalizedParams)}`,
          },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: copy.title,
        description: copy.description,
        url: `${getSiteOrigin()}${buildJobsPagePath(locale, normalizedParams)}`,
      },
      {
        '@type': 'ItemList',
        itemListElement: jobsData.data.map((job, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${getSiteOrigin()}/${locale}/jobs/${job.id}`,
          name: job.title ?? t('jobsPage.job'),
        })),
      },
    ],
  };

  return (
    <section className="bg-body-bg">
      <GpuFixClient />
      <Breadcrumb
        title={t('header.jobs')}
        items={[
          { label: t('header.home'), href: '/' },
          { label: t('header.jobs'), href: '/jobs' },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <JobsFilterSection
        locale={locale}
        actionPath={actionPath}
        heading={copy.title}
        description={copy.description}
        search={normalizedParams.search}
        country={normalizedParams.country}
        countries={filtersData.countries}
        popularSearches={popularSearches}
        popularSearchesCurrentPage={popularSearchesPage.currentPage}
        popularSearchesLastPage={popularSearchesPage.lastPage}
        hiddenInputs={hiddenInputs}
      />

      <section className="layout-shell">
        <section className="layout-content">
          <div className="mt-4 flex items-center justify-between lg:mt-6 lg:hidden">
            <MobileFilterDrawer
              actionPath={actionPath}
              search={normalizedParams.search}
              country={normalizedParams.country}
              filters={filterState}
              sections={filterSections}
              salaryTypeOptions={filtersData.salaryTypes}
            />
          </div>
          <section className="mt-4 rounded-2xl bg-white p-4 lg:mt-6">
            {/* ── Mobile / Tablet filter trigger ──────────────────────────── */}

            <div className="grid grid-cols-4 lg:gap-6">
              {/* ── Desktop sidebar (hidden on mobile via its own class) ──── */}
              <div className="col-span-4 lg:col-span-1">
                <JobsSideBarFilter
                  actionPath={actionPath}
                  search={normalizedParams.search}
                  country={normalizedParams.country}
                  filters={filterState}
                  sections={filterSections}
                  salaryTypeOptions={filtersData.salaryTypes}
                />
              </div>

              {/* ── Jobs list ────────────────────────────────────────────── */}
              <div className="col-span-4 lg:col-span-3">
                <JobsList
                  jobs={jobsData.data}
                  currentPage={jobsData.current_page}
                  totalItems={jobsData.total}
                  pageSize={jobsData.per_page}
                  locale={locale}
                  filters={normalizedParams}
                />
              </div>
            </div>
          </section>
        </section>
      </section>
    </section>
  );
}
