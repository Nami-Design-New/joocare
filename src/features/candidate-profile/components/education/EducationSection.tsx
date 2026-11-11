'use client';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { EducationModal } from './EducationModal';
import OneEducationSection from './OneEducationSection';
import type { CandidateProfileViewModel } from '../../types/profile.types';
import { useTranslations } from 'next-intl';

const EducationSection = ({
  profile,
  readOnly = false,
}: {
  profile: CandidateProfileViewModel | null;
  readOnly?: boolean;
}) => {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const educations = profile?.educations ?? [];
  return (
    <>
      <section className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6.5 font-semibold md:text-xl">
            {t('candidatePage.profile.education')}
          </h3>
          {!readOnly && (
            <Plus
              size={22}
              className="cursor-pointer"
              onClick={() => setOpen(!open)}
            />
          )}
        </div>

        {educations.length > 0 ? (
          <div className="flex flex-col gap-4">
            {educations.map((education) => (
              <OneEducationSection
                key={education.id}
                education={education}
                readOnly={readOnly}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t('candidatePage.profile.no-education')}
          </p>
        )}
      </section>
      {open && (
        <EducationModal
          label={t('candidatePage.profile.add-education')}
          open={open}
          onOpenChange={setOpen}
          education={null}
        />
      )}
    </>
  );
};

export default EducationSection;
