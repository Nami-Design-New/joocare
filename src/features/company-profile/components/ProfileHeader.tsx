'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Camera } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useSession } from 'next-auth/react';
import { TCompanyProfileViewModel } from '../types';
import { useUpdateCompanyImagesFlow } from '../hooks/useUpdateCompanyImagesFlow';
import { useLocale, useTranslations } from 'next-intl';

type FormValues = {
  uploadCoverImage?: File | string;
  uploadLogoImage?: File | string;
};

const ProfileHeader = ({
  companyProfileData,
  isPending,
}: {
  companyProfileData: TCompanyProfileViewModel;
  isPending: boolean;
}) => {
  const t = useTranslations();
  const locale = useLocale();

  const { data: session } = useSession();
  const token = session?.accessToken || '';

  const { handleChangeImage, loadingField } = useUpdateCompanyImagesFlow({
    token,
  });

  const { watch, control } = useForm<FormValues>();

  const uploadCoverImage = watch('uploadCoverImage');
  const uploadLogoImage = watch('uploadLogoImage');

  const coverPreview =
    uploadCoverImage && uploadCoverImage instanceof File
      ? URL.createObjectURL(uploadCoverImage)
      : companyProfileData?.cover;

  const logoPreview =
    uploadLogoImage && uploadLogoImage instanceof File
      ? URL.createObjectURL(uploadLogoImage)
      : companyProfileData?.image;

  const coverRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mb-14 h-48 w-full sm:mb-20 sm:h-93.75">
      <div className="relative">
        {/* COVER */}
        <Controller
          name="uploadCoverImage"
          control={control}
          render={({ field: { onChange } }) => (
            <div className="relative h-48 w-full overflow-hidden rounded-3xl border sm:h-93.75 sm:rounded-[40px]">
              {isPending ? (
                <div className="flex h-full w-full items-center justify-center">
                  {t('common.loading')}
                </div>
              ) : (
                <Image
                  src={coverPreview || '/image.png'}
                  alt={t('companyPage.profile.cover-alt')}
                  fill
                  className="object-cover"
                />
              )}
              {loadingField === 'cover' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
                  {t('common.uploading')}
                </div>
              )}

              <input
                ref={coverRef}
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  onChange(file);

                  handleChangeImage(file, 'cover').then((success) => {
                    if (!success) {
                      onChange(undefined);
                    }
                  });
                }}
              />

              <button
                onClick={() => coverRef.current?.click()}
                className="absolute top-4 right-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/60"
              >
                <Camera className="h-5 w-5 text-white" />
              </button>
            </div>
          )}
        />

        {/* LOGO */}
        <Controller
          name="uploadLogoImage"
          control={control}
          render={({ field: { onChange } }) => (
            <div
              className={cn(
                `absolute -bottom-8 sm:-bottom-12 ${locale === 'ar' ? 'right-4 sm:right-8' : 'left-4 sm:left-8'}`,
                'size-24 rounded-full border bg-white sm:size-37.5',
                'flex cursor-pointer items-center justify-center',
                'ring-4 ring-white',
              )}
            >
              {isPending ? (
                <div className="flex h-full w-full items-center justify-center">
                  {t('common.uploading')}
                </div>
              ) : (
                <Image
                  src={logoPreview || '/image.png'}
                  alt={t('companyPage.profile.logo-alt')}
                  fill
                  className="rounded-full object-cover"
                />
              )}

              {loadingField === 'logo' && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-xs text-white">
                  {t('common.uploading')}
                </div>
              )}

              <input
                ref={logoRef}
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  onChange(file);

                  handleChangeImage(file, 'logo').then((success) => {
                    if (!success) {
                      onChange(undefined);
                    }
                  });
                }}
              />

              <button
                onClick={() => logoRef.current?.click()}
                className="absolute right-3 bottom-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-secondary transition"
              >
                <Camera className="h-3 w-3 text-white" />
              </button>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default ProfileHeader;
