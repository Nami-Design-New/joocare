'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { FileUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { InputField } from '@/shared/components/InputField';
import { Button } from '@/shared/components/ui/button';
import { Switch } from '@/shared/components/ui/switch';
import { MAX_ATTACHMENT_BYTES } from '../../constants/assessment-builder';
import { useAttachmentPreview } from '../../hooks/useAttachmentPreview';

type QuestionAttachmentFieldProps = {
  enabled: boolean;
  file: File | null;
  error?: string;
  onEnabledChange: (enabled: boolean) => void;
  onChange: (file: File | null) => void;
};

export default function QuestionAttachmentField({
  enabled,
  file,
  error,
  onEnabledChange,
  onChange,
}: QuestionAttachmentFieldProps) {
  const t = useTranslations('companyPage.assessments.builder');
  const input = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState('');
  const preview = useAttachmentPreview(file);
  function selectFile(next: File | null) {
    if (
      next &&
      (!['image/png', 'image/jpeg'].includes(next.type) ||
        next.size > MAX_ATTACHMENT_BYTES)
    ) {
      setFileError(t('validation.attachment'));
      return;
    }
    setFileError('');
    onChange(next);
  }
  return (
    <div className="space-y-4">
      <div className="bg-muted flex items-center gap-4 rounded-2xl p-4">
        <FileUp aria-hidden="true" className="text-primary size-6 shrink-0" />
        <div className="flex-1">
          <label
            htmlFor="question-attachment-enabled"
            className="font-semibold"
          >
            {t('add-attachment')}
          </label>
          <p className="text-muted-foreground text-sm">
            {t('attachment-description')}
          </p>
        </div>
        <Switch
          id="question-attachment-enabled"
          checked={enabled}
          onCheckedChange={onEnabledChange}
        />
      </div>
      {enabled && (
        <>
          <InputField
            ref={input}
            id="question-attachment-file"
            type="file"
            accept="image/png,image/jpeg"
            aria-label={t('browse')}
            containerStyles="sr-only"
            onChange={(event) => {
              selectFile(event.target.files?.[0] ?? null);
              event.target.value = '';
            }}
          />
          {file && preview ? (
            <div className="border-border flex flex-col gap-5 rounded-2xl border p-4 sm:flex-row sm:items-center">
              <Image
                src={preview}
                alt={t('attachment-preview')}
                width={288}
                height={162}
                unoptimized
                className="aspect-video w-full rounded-lg object-contain sm:w-64"
              />
              <div className="min-w-0">
                <p className="font-semibold break-all">{file.name}</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {t('image-details', { size: Math.ceil(file.size / 1024) })}
                </p>
                <div className="mt-2 flex gap-4">
                  <Button
                    variant="link"
                    type="button"
                    className="h-auto p-0 underline"
                    onClick={() => input.current?.click()}
                  >
                    {t('replace-image')}
                  </Button>
                  <Button
                    variant="link"
                    type="button"
                    className="text-destructive h-auto p-0 underline"
                    onClick={() => selectFile(null)}
                  >
                    {t('remove-image')}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="border-primary bg-primary-bg flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed p-5 text-center"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                if (event.dataTransfer.files.length !== 1) {
                  setFileError(t('validation.attachment'));
                  return;
                }
                selectFile(event.dataTransfer.files[0]);
              }}
            >
              <span className="bg-card text-primary mb-3 rounded-full p-3">
                <FileUp aria-hidden="true" className="size-6" />
              </span>
              <p className="font-semibold">
                {t('drop-image')}{' '}
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0 text-base font-semibold underline"
                  onClick={() => input.current?.click()}
                >
                  {t('browse')}
                </Button>
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                {t('attachment-hint')}
              </p>
            </div>
          )}
          {(fileError || error) && (
            <p role="alert" className="text-destructive text-sm">
              {fileError || error}
            </p>
          )}
        </>
      )}
    </div>
  );
}
