'use client';

import { TCompanyProfile } from '@/features/company-profile/types';
import { Badge } from '@/shared/components/ui/badge';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const AccountUnderReview = ({
  companyProfileData,
}: {
  companyProfileData: TCompanyProfile;
}) => {
  const t = useTranslations();
  return (
    <section className="flex flex-col gap-3 rounded-2xl border bg-background px-4 py-3">
      <div className="flex w-full items-center gap-2">
        <Image
          src={companyProfileData?.image || '/assets/new-logo-dot.svg'}
          alt={t('companyPage.sidebar.profile-image-alt')}
          width={60}
          height={60}
          className="h-15 w-15 rounded-full object-contain"
        />
        <div>
          <p className="text-base font-semibold text-black">
            {companyProfileData?.name}
          </p>
          <p className="mt-1 text-base font-normal">
            {companyProfileData?.domain?.title}
          </p>
        </div>
      </div>
      {companyProfileData?.status === 'Pending' && (
        <p className="text-sm text-wrap text-muted-foreground">
          {companyProfileData?.bio?.slice(0, 100)}
        </p>
      )}
      {companyProfileData?.status === 'Rejected' && (
        <p className="text-sm text-wrap text-muted-foreground">
          {companyProfileData?.rejection_reason}
        </p>
      )}
      {companyProfileData?.status === 'Pending' && (
        <Badge className="mt-2 w-full justify-start bg-warning-bg px-4 py-1 text-base font-normal whitespace-normal text-warning">
          {t('companyPage.sidebar.account-under-review')}
        </Badge>
      )}
      {companyProfileData?.status === 'Rejected' && (
        <Badge className="mt-2 w-full justify-start bg-red-50 px-4 py-1 text-base font-normal whitespace-normal text-red-500">
          {t('companyPage.sidebar.account-review-rejected')}
        </Badge>
      )}
    </section>
  );
};

export default AccountUnderReview;
