'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import { useAttachmentPreview } from '../../hooks/useAttachmentPreview';
import type { BuilderQuestion } from '../../types/assessment-builder.types';

type QuestionPreviewProps = { question: BuilderQuestion };

export default function QuestionPreview({ question }: QuestionPreviewProps) {
  const t = useTranslations('companyPage.assessments.builder');
  const preview = useAttachmentPreview(
    question.attachmentEnabled ? question.attachment : null,
  );
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="border-border rounded-full border px-4 py-3">
          {t(question.type)}
        </div>
        <div className="border-border flex justify-between rounded-full border px-4 py-3">
          <span>{question.score}</span>
          <span>%</span>
        </div>
      </div>
      {preview && (
        <Image
          src={preview}
          alt={t('attachment-preview')}
          width={1200}
          height={675}
          unoptimized
          className="aspect-video max-h-64 w-full rounded-xl object-contain"
        />
      )}
      <p className="border-border rounded-3xl border px-4 py-3 text-sm">
        {question.questionText}
      </p>
      {question.type === 'yes-no' ? (
        <div>
          <p className="mb-3 text-sm font-semibold">{t('correct-answer')}</p>
          <div className="grid grid-cols-2 gap-2">
            {['yes', 'no'].map((answer) => (
              <span
                key={answer}
                className={cn(
                  'rounded-full px-4 py-3 text-center text-sm',
                  question.correctAnswers.includes(answer)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {t(answer)}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-muted-foreground text-sm">{t('answer-options')}</p>
          {question.options.map((option, index) => (
            <div key={option.id} className="flex items-center gap-3 text-sm">
              <span className="text-muted-foreground">
                {String.fromCharCode(65 + index)}.
              </span>
              <span
                className={cn(
                  'border-border flex-1 rounded-full border px-4 py-2',
                  question.correctAnswers.includes(option.id) &&
                    'bg-primary-bg text-primary',
                )}
              >
                {option.text}
              </span>
            </div>
          ))}
          <div className="border-border border-t pt-4">
            <p className="mb-2 text-sm font-semibold">{t('correct-answer')}</p>
            <p className="border-border rounded-full border px-4 py-3 text-sm">
              {question.options
                .flatMap((option, index) =>
                  question.correctAnswers.includes(option.id)
                    ? [String.fromCharCode(65 + index)]
                    : [],
                )
                .join(', ')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
