'use client';

import { cn } from '@/shared/lib/utils';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { CompanyProfile } from '../company-profile.type';

export default function HeaderSection({
  company,
}: {
  company: CompanyProfile;
}) {
  const t = useTranslations();
  const locale = useLocale();
  return (
    <>
      <div className="mb-20 h-72 w-full">
        <div className="relative">
          {/* COVER */}
          <div
            className={cn(
              'relative h-75 w-full rounded-[40px] border bg-muted',
              'flex items-center justify-center overflow-hidden',
              'transition hover:bg-border',
            )}
          >
            <Image
              src={company?.cover ?? '/assets/cover.svg'}
              alt={t('sharedCompanyProfilePage.cover-image', {
                companyName:
                  company.name ?? t('sharedCompanyProfilePage.this-company'),
              })}
              fill
              className="object-cover"
            />
          </div>

          {/* LOGO */}
          <div
            className={cn(
              `absolute -bottom-16 ${locale === 'ar' ? 'right-8' : 'left-8'}`,
              'h-37.5 w-37.5 rounded-full border bg-white',
              'flex items-center justify-center',
              'ring-4 ring-white',
            )}
          >
            <Image
              src={company?.image ?? '/assets/image_2.svg'}
              alt={t('sharedCompanyProfilePage.logo-image', {
                companyName:
                  company.name ?? t('sharedCompanyProfilePage.this-company'),
              })}
              fill
              className="rounded-full object-cover"
            />
          </div>
        </div>
        <div className="mt-2 hidden items-center justify-start lg:flex">
          <div className="w-48"></div>
          <h2 className="text-[28px] font-semibold">{company.name}</h2>
        </div>
      </div>

      <h2 className="mb-8 text-[28px] font-semibold lg:mb-0 lg:opacity-0">
        {company.name}
      </h2>
    </>
  );
}
