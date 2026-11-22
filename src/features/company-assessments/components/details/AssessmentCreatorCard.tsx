'use client';

import { UserRound } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Card } from '@/shared/components/ui/card';

// `#` marks this card as static: the assessment API does not return its creator yet.
export default function AssessmentCreatorCard() {
  const t = useTranslations('companyPage.assessments.details');

  return (
    <Card className="flex-col items-start gap-2 rounded-2xl border-0 px-4 py-3 shadow-none">
      <p className="text-xs font-semibold text-secondary">
        {t('created-by')} #
      </p>
      <div className="flex items-center gap-3">
        <Avatar className="size-10 bg-success text-white">
          <AvatarFallback className="bg-success text-white">
            <UserRound aria-hidden="true" className="size-5" />
          </AvatarFallback>
        </Avatar>
        <p className="text-xs font-semibold text-secondary">—</p>
      </div>
    </Card>
  );
}
