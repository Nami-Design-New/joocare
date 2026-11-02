'use client';

import { FileText, UsersRound } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { CandidateCv } from '../../types/candidate-cv.types';
import CvAdditionalInfo from './CvAdditionalInfo';
import CvCertifications from './CvCertifications';
import CvEducation from './CvEducation';
import CvEntryList from './CvEntryList';
import CvExperience from './CvExperience';
import CvHeader from './CvHeader';
import CvHighlights from './CvHighlights';
import CvLanguages from './CvLanguages';
import CvSectionTitle from './CvSectionTitle';
import CvSkills from './CvSkills';

type CandidateCvDocumentProps = {
  cv: CandidateCv;
};

export default function CandidateCvDocument({ cv }: CandidateCvDocumentProps) {
  const t = useTranslations('companyPage.projects.cv');

  return (
    <article className="flex flex-col gap-6">
      <CvHeader name={cv.name} jobTitle={cv.jobTitle} contact={cv.contact} />

      <section className="bg-primary/5 flex flex-col gap-3.5 rounded-xl px-6 pt-5.5 pb-6">
        <CvSectionTitle
          icon={FileText}
          title={t('professional-summary')}
          size="lg"
        />
        <p className="text-secondary text-[15px] leading-6">{cv.summary}</p>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_330px] lg:gap-5">
        <div className="divide-border flex flex-col divide-y [&>*]:py-6 [&>*:first-child]:pt-0">
          <CvSkills title={t('skills')} skills={cv.skills} />
          <CvExperience title={t('experience')} experiences={cv.experiences} />
          <CvEntryList
            icon={FileText}
            title={t('publications')}
            entries={cv.publications}
            linkLabel={(title) => t('open-link', { title })}
          />
          <CvEntryList
            icon={UsersRound}
            title={t('conferences')}
            entries={cv.conferences}
            linkLabel={(title) => t('open-link', { title })}
          />
        </div>

        <aside className="divide-border lg:border-border relative flex flex-col divide-y lg:border-s lg:ps-5 [&>*]:py-6 [&>*:first-child]:pt-0">
          <Image
            src="/assets/company-projects/cv-watermark.svg"
            alt=""
            width={46}
            height={48}
            className="pointer-events-none absolute end-0 top-16"
          />
          <CvHighlights title={t('highlights')} highlights={cv.highlights} />
          <CvCertifications
            title={t('certifications')}
            certifications={cv.certifications}
          />
          <CvEducation title={t('education')} educations={cv.educations} />
          <CvLanguages title={t('languages')} languages={cv.languages} />
          <CvAdditionalInfo
            title={t('additional-info')}
            details={cv.additionalInfo}
            getLabel={(key) => t(key)}
          />
        </aside>
      </div>
    </article>
  );
}
