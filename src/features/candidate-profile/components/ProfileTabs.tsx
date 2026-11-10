import { getTranslations } from 'next-intl/server';
import HeaderLayout from '@/shared/components/HeaderLayout';
import { PROFILE_TAB_LINKS } from '../constants';

// "Home / Additional Information" tabs of the candidate profile page.
export default async function ProfileTabs() {
  const t = await getTranslations();
  return (
    <HeaderLayout
      navLinks={PROFILE_TAB_LINKS.map((link) => ({
        href: link.href,
        label: t(link.label),
      }))}
    />
  );
}
