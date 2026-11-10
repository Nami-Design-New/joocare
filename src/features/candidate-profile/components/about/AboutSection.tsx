'use client';
import { Edit2 } from 'lucide-react';
import { useState } from 'react';
import { EditAboutModal } from './EditAboutModal';
import type { CandidateProfileViewModel } from '../../types/profile.types';
import { useTranslations } from 'next-intl';

const AboutSection = ({
  profile,
  readOnly = false,
}: {
  profile: CandidateProfileViewModel | null;
  readOnly?: boolean;
}) => {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const bioText = profile?.bio ?? '';
  const aboutText = bioText || t('candidatePage.profile.no-bio');
  return (
    <>
      <div className="border-border flex flex-col gap-3 rounded-2xl border bg-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[21px] leading-6.5 font-semibold">
            {t('candidatePage.profile.about')}
          </h3>
          {!readOnly && (
            <Edit2
              size={22}
              className="cursor-pointer"
              onClick={() => setOpen(!open)}
            />
          )}
        </div>
        <p className="text-muted-foreground text-start text-sm md:text-base sm:text-justify">
          {aboutText}
        </p>
      </div>
      {open && (
        <EditAboutModal
          open={open}
          onOpenChange={setOpen}
          defaultVal={bioText}
        />
      )}
    </>
  );
};

export default AboutSection;
