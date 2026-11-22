'use client';

import { UserRound } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Card } from '@/shared/components/ui/card';
import type { SavedAssessment } from '../../types/assessment-builder.types';

type AssessmentCreatorCardProps = {
  /** `company_admin` from the assessment details API. */
  creator: SavedAssessment['createdBy'];
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export default function AssessmentCreatorCard({
  creator,
}: AssessmentCreatorCardProps) {
  const t = useTranslations('companyPage.assessments.details');

  return (
    <Card className="flex-col items-start gap-2 rounded-2xl border-0 px-4 py-3 shadow-none">
      <p className="text-xs font-semibold text-secondary">{t('created-by')}</p>
      <div className="flex items-center gap-3">
        <Avatar className="size-10 bg-success text-white">
          <AvatarFallback className="bg-success text-xs font-semibold text-white">
            {creator ? (
              getInitials(creator.name)
            ) : (
              <UserRound aria-hidden="true" className="size-5" />
            )}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-xs font-semibold text-secondary">
            {creator?.name ?? '—'}
          </p>
          {creator?.role ? (
            <p className="text-[10px] text-muted-foreground">{creator.role}</p>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
