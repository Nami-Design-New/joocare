'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import CertificateCard from '@/features/candidate-credentials/components/certificates/CertificateCard';
import LicenseCard from '@/features/candidate-credentials/components/licenses/LicenseCard';
import QualificationCard from '@/features/candidate-credentials/components/qualifications/QualificationCard';
import EmptyDataState from '@/shared/components/EmptyDataState';
import { buttonVariants } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import type {
  CandidateCredentialTab,
  ProjectCandidateProfile,
} from '../../types/candidate-profile.types';

const CREDENTIAL_TABS: CandidateCredentialTab[] = [
  'qualifications',
  'certificates',
  'licenses',
];

type CandidateCredentialsTabsProps = Pick<
  ProjectCandidateProfile,
  'qualifications' | 'certificates' | 'licenses'
>;

export default function CandidateCredentialsTabs({
  qualifications,
  certificates,
  licenses,
}: CandidateCredentialsTabsProps) {
  const t = useTranslations('companyPage.projects.candidate-profile');
  const [activeTab, setActiveTab] =
    useState<CandidateCredentialTab>('qualifications');

  const counts: Record<CandidateCredentialTab, number> = {
    qualifications: qualifications.length,
    certificates: certificates.length,
    licenses: licenses.length,
  };

  return (
    <section className="bg-card flex flex-col gap-6 rounded-2xl border p-4">
      <div
        role="tablist"
        aria-label={t('credentials')}
        className="flex w-full gap-2 overflow-x-auto rounded-full p-2 shadow sm:w-fit"
      >
        {CREDENTIAL_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            id={`credential-tab-${tab}`}
            aria-selected={activeTab === tab}
            aria-controls={`credential-panel-${tab}`}
            onClick={() => setActiveTab(tab)}
            className={cn(
              buttonVariants({
                variant: activeTab === tab ? 'default' : 'ghost',
                size: 'pill',
              }),
              'shrink-0 text-lg font-normal',
              activeTab !== tab && 'text-muted-foreground',
            )}
          >
            {t(tab)}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`credential-panel-${activeTab}`}
        aria-labelledby={`credential-tab-${activeTab}`}
        className="flex flex-col gap-3"
      >
        {counts[activeTab] === 0 && (
          <EmptyDataState
            title={`companyPage.projects.candidate-profile.no-${activeTab}`}
          />
        )}
        {activeTab === 'qualifications' &&
          qualifications.map((qualification) => (
            <QualificationCard
              key={qualification.id}
              qualification={qualification}
              readOnly
            />
          ))}
        {activeTab === 'certificates' &&
          certificates.map((certificate) => (
            <CertificateCard
              key={certificate.id}
              certificate={certificate}
              readOnly
            />
          ))}
        {activeTab === 'licenses' && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {licenses.map((license) => (
              <LicenseCard key={license.id} license={license} readOnly />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
