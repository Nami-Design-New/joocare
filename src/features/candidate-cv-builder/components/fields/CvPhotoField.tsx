'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';
import { CV_BUILDER_ICONS } from '../../constants';
import type { CvBuilderValues } from '../../types/cv-builder.types';

// Round profile-photo picker. Design only: the photo is kept as a local preview URL.
export default function CvPhotoField() {
  const t = useTranslations('candidatePage.buildCv.personal');

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
                src={field.value}
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
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (!file) return;
                if (field.value) URL.revokeObjectURL(field.value);
                field.onChange(URL.createObjectURL(file));
              }}
            />
          </label>
          <p className="flex items-baseline gap-2 px-1">
            <span className="text-base leading-5 font-semibold text-foreground">
              {t('photo')}
            </span>
            <span className="text-sm text-muted-foreground">
              {t('optional')}
            </span>
          </p>
        </div>
      )}
    />
  );
}
