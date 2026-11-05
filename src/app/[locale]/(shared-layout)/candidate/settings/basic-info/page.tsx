import { getTranslations } from 'next-intl/server';

import { getCandidateProfile } from '@/features/candidate-profile/services/profile-service';
import BasicInfoForm from '@/features/candidate-settings/components/basic-info/BasicInfoForm';
import SettingsPageHeader from '@/features/candidate-settings/components/SettingsPageHeader';
import { mapCandidateProfileToSettingsProfile } from '@/features/candidate-settings/services/basic-info-service';

const BasicInfoPage = async () => {
  const t = await getTranslations('candidateSettingsPage');
  const profile = await getCandidateProfile();

  return (
    <div className="flex flex-col gap-6">
      <SettingsPageHeader
        title={t('basic-info.title')}
        description={t('basic-info.subtitle')}
      />
      <section className="bg-card rounded-2xl p-6">
        {profile ? (
          <BasicInfoForm
            profile={mapCandidateProfileToSettingsProfile(profile)}
          />
        ) : (
          <p className="text-muted-foreground text-sm">
            {t('unable-load-profile')}
          </p>
        )}
      </section>
    </div>
  );
};

export default BasicInfoPage;
