import { getTranslations } from 'next-intl/server';

import ChangePasswordForm from '@/features/candidate-settings/components/change-password/ChangePasswordForm';
import SettingsPageHeader from '@/features/candidate-settings/components/SettingsPageHeader';

const ChangePasswordPage = async () => {
  const t = await getTranslations('candidateSettingsPage.change-password');

  return (
    <div className="flex flex-col gap-6">
      <SettingsPageHeader title={t('title')} description={t('subtitle')} />
      <section className="rounded-2xl bg-card p-2 md:p-6">
        <ChangePasswordForm />
      </section>
    </div>
  );
};

export default ChangePasswordPage;
