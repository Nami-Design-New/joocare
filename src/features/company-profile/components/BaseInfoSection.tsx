'use client';

import { TCompanyProfileViewModel } from '../types';
import TextSkeleton from './TextSkeleton';
import { useTranslations } from 'next-intl';

const BaseInfoSection = ({
  companyProfileData,
  isPending,
}: {
  companyProfileData: TCompanyProfileViewModel;
  isPending: boolean;
}) => {
  const t = useTranslations();
  return (
    <div className="flex flex-col gap-5 rounded-2xl border bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {t('companyPage.profile.baseInfo.title')}
        </h2>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-muted-foreground">
          {t('companyPage.profile.baseInfo.official-email')}
        </span>
        {isPending ? (
          <TextSkeleton />
        ) : (
          <span className="text-sm font-semibold">
            {companyProfileData?.email}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-muted-foreground">
          {t('companyPage.profile.baseInfo.location')}
        </span>
        {isPending ? (
          <TextSkeleton />
        ) : (
          <span className="text-sm font-semibold">
            {companyProfileData?.city?.name},{' '}
            {companyProfileData?.country?.name}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-muted-foreground">
          {t('companyPage.profile.baseInfo.official-phone')}
        </span>
        {isPending ? (
          <TextSkeleton />
        ) : (
          <span className="text-sm font-semibold">
            {companyProfileData?.phone_code}
            {companyProfileData?.phone}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-muted-foreground">
          {t('companyPage.profile.baseInfo.founded')}
        </span>
        {isPending ? (
          <TextSkeleton />
        ) : (
          <span className="text-sm font-semibold">
            {companyProfileData?.established_date}
          </span>
        )}
      </div>
    </div>
  );
};

export default BaseInfoSection;
