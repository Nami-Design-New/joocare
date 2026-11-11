'use client';

import { cn } from '@/shared/lib/utils';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { useFormContext, Controller, useWatch } from 'react-hook-form';
import { useUploadImage } from '@/shared/hooks/useUploadImage';
import { useLocale, useTranslations } from 'next-intl';

// ✅ Lives outside the component — survives step navigation
const imagePreviewCache = {
  cover: null as string | null,
  logo: null as string | null,
};

export default function CoverUploadImage() {
  const t = useTranslations();
  const locale = useLocale();
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext();

  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [coverUploading, setCoverUploading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);

  // ✅ Initialize from cache so images reappear when returning to step
  const [coverLocalPreview, setCoverLocalPreview] = useState<string | null>(
    () => imagePreviewCache.cover,
  );
  const [logoLocalPreview, setLogoLocalPreview] = useState<string | null>(
    () => imagePreviewCache.logo,
  );

  const { mutateAsync: uploadImage } = useUploadImage();

  // ✅ Wrapped setters that also update the cache
  const setCoverPreview = (url: string | null) => {
    imagePreviewCache.cover = url;
    setCoverLocalPreview(url);
  };

  const setLogoPreview = (url: string | null) => {
    imagePreviewCache.logo = url;
    setLogoLocalPreview(url);
  };

  const handleCoverChange = async (file: File) => {
    const localUrl = URL.createObjectURL(file);
    setCoverPreview(localUrl); // ✅ saves to cache too
    setCoverUploading(true);

    try {
      const response = await uploadImage(file);
      const imagePath = response?.data?.data?.image;

      if (response?.data?.message === 'Success' && imagePath) {
        setValue('uploadCoverImage', imagePath);
      } else {
        throw new Error('Upload failed or no image path returned');
      }
    } catch (error) {
      console.error('Failed to upload cover image', error);
      URL.revokeObjectURL(localUrl);
      setCoverPreview(null); // ✅ clears cache too
      setValue('uploadCoverImage', null);
    } finally {
      setCoverUploading(false);
    }
  };

  const handleLogoChange = async (file: File) => {
    const localUrl = URL.createObjectURL(file);
    setLogoPreview(localUrl); // ✅ saves to cache too
    setLogoUploading(true);

    try {
      const response = await uploadImage(file);
      const imagePath = response?.data?.data?.image;

      if (response?.data?.message === 'Success' && imagePath) {
        setValue('uploadLogoImage', imagePath);
      } else {
        throw new Error('Upload failed or no image path returned');
      }
    } catch (error) {
      console.error('Failed to upload logo image', error);
      URL.revokeObjectURL(localUrl);
      setLogoPreview(null); // ✅ clears cache too
      setValue('uploadLogoImage', null);
    } finally {
      setLogoUploading(false);
    }
  };

  return (
    <>
      <div className="h-60 w-full sm:h-93.75">
        <div className="relative">
          {/* COVER IMAGE */}
          <Controller
            name="uploadCoverImage"
            control={control}
            render={() => (
              <div
                onClick={() =>
                  !coverUploading && coverInputRef.current?.click()
                }
                className={cn(
                  'relative h-44 w-full rounded-3xl border bg-muted sm:h-75 sm:rounded-[50px]',
                  'flex cursor-pointer flex-col items-center justify-center',
                  'transition-colors duration-200 hover:bg-border',
                  errors.uploadCoverImage
                    ? 'border-red-500'
                    : 'border-transparent',
                  coverUploading && 'pointer-events-none',
                )}
              >
                {coverLocalPreview ? (
                  <Image
                    src={coverLocalPreview}
                    alt={t('completeAccount.upload.cover-alt')}
                    fill
                    className="rounded-3xl object-cover sm:rounded-[50px]"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-foreground/50">
                    <Image
                      width={60}
                      height={60}
                      src="/assets/icons/upload-image-icon.svg"
                      alt={t('completeAccount.upload.upload-icon-alt')}
                    />
                    <span className="text-sm">
                      {t('completeAccount.upload.cover-cta')}
                    </span>
                  </div>
                )}

                {coverUploading && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-3xl bg-black/50 sm:rounded-[50px]">
                    <svg
                      className="animate-spin text-white"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                    <span className="text-sm font-medium text-white">
                      {t('common.uploading')}
                    </span>
                  </div>
                )}

                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  disabled={coverUploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    e.target.value = '';
                    handleCoverChange(file);
                  }}
                />
              </div>
            )}
          />

          {/* LOGO IMAGE */}
          <Controller
            name="uploadLogoImage"
            control={control}
            render={() => (
              <div
                onClick={() => !logoUploading && logoInputRef.current?.click()}
                className={cn(
                  `absolute bottom-0 translate-y-1/2 ${locale === 'ar' ? 'right-6' : 'left-6'}`,
                  'size-24 rounded-full border sm:size-37.5',
                  'flex cursor-pointer flex-col items-center justify-center',
                  'bg-[#EBEBEB] transition-colors duration-200 hover:bg-[#e0e0e0]',
                  'z-10 ring-4 ring-white',
                  errors.uploadLogoImage
                    ? 'border-red-500'
                    : 'border-transparent',
                  logoUploading && 'pointer-events-none',
                )}
              >
                {logoLocalPreview ? (
                  <Image
                    src={logoLocalPreview}
                    alt={t('completeAccount.upload.logo-alt')}
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 px-1 text-center text-foreground/50">
                    <Image
                      width={40}
                      height={40}
                      src="/assets/icons/upload-image-icon.svg"
                      alt={t('completeAccount.upload.upload-icon-alt')}
                    />
                    <span className="text-[10px] leading-tight">
                      {t('completeAccount.upload.logo-cta')}
                    </span>
                  </div>
                )}

                {logoUploading && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 rounded-full bg-black/50">
                    <svg
                      className="animate-spin text-white"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                    <span className="text-[10px] font-medium text-white">
                      {t('completeAccount.upload.uploading-short')}
                    </span>
                  </div>
                )}

                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  disabled={logoUploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    e.target.value = '';
                    handleLogoChange(file);
                  }}
                />
              </div>
            )}
          />
        </div>
      </div>

      {(errors.uploadCoverImage || errors.uploadLogoImage) && (
        <span className="-mt-2 text-[12px] text-red-500">
          {errors.uploadCoverImage && errors.uploadLogoImage
            ? t('completeAccount.upload.cover-and-logo-required')
            : errors.uploadCoverImage?.message?.toString() ||
              errors.uploadLogoImage?.message?.toString()}
        </span>
      )}
    </>
  );
}
