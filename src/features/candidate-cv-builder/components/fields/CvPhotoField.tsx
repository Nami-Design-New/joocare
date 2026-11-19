'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';
import { useUploadImage } from '@/shared/hooks/useUploadImage';
import { resolveStorageUrl } from '@/shared/lib/storage-url';
import { CV_BUILDER_ICONS } from '../../constants';
import type { CvBuilderValues } from '../../types/cv-builder.types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function getUploadedImagePath(value: unknown): string | null {
  if (!isRecord(value) || !isRecord(value.data)) return null;

  if (typeof value.data.image === 'string') return value.data.image;
  if (isRecord(value.data.data) && typeof value.data.data.image === 'string') {
    return value.data.data.image;
  }

  return null;
}

// Round profile-photo picker. The saved image path is kept in the form.
export default function CvPhotoField() {
  const t = useTranslations('candidatePage.buildCv.personal');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { mutateAsync: uploadImage, isPending } = useUploadImage();

  return (
    <Controller<CvBuilderValues, 'personal.photo'>
      name="personal.photo"
      render={({ field }) => (
        <div className="flex flex-col items-center gap-2">
          <label
            htmlFor="personal-photo"
            className="relative flex size-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border bg-muted transition-colors hover:border-cv-builder-primary"
          >
            {field.value ? (
              <Image
                src={resolveStorageUrl(field.value) ?? field.value}
                alt={t('photo')}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <Image
                src={CV_BUILDER_ICONS.cameraAdd}
                alt=""
                width={32}
                height={32}
              />
            )}
            <input
              id="personal-photo"
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={isPending}
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (!file) return;
                setUploadError(null);
                void uploadImage(file)
                  .then((response) => {
                    const imagePath = getUploadedImagePath(response);

                    if (!imagePath) {
                      throw new Error(t('upload-failed'));
                    }

                    field.onChange(imagePath);
                  })
                  .catch(() => setUploadError(t('upload-failed')));
              }}
            />
            {isPending && (
              <span className="absolute inset-0 flex items-center justify-center bg-foreground/30">
                <Loader2 className="size-6 animate-spin text-primary-foreground" />
              </span>
            )}
          </label>
          <p className="flex items-baseline gap-2 px-1">
            <span className="text-base leading-5 font-semibold text-foreground">
              {t('photo')}
            </span>
            <span className="text-sm text-muted-foreground">
              {t('optional')}
            </span>
          </p>
          {uploadError && (
            <p className="text-sm text-destructive">{uploadError}</p>
          )}
        </div>
      )}
    />
  );
}
