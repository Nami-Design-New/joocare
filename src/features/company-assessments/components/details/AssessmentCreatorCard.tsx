'use client';

import { useTranslations } from 'next-intl';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Card } from '@/shared/components/ui/card';

export default function AssessmentCreatorCard({
  creator,
}: {
  creator: { name: string; role: string; initials: string };
}) {
  const t = useTranslations('companyPage.assessments.details');

  return (
    <Card className="flex-col items-start gap-2 rounded-2xl border-0 px-4 py-3 shadow-none">
      <p className="text-xs font-semibold text-secondary">{t('created-by')}</p>
      <div className="flex items-center gap-3">
        <Avatar className="size-10 bg-success text-white">
          <AvatarFallback className="bg-success text-xs font-semibold text-white">
            {creator.initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-xs font-semibold text-secondary">{creator.name}</p>
          <p className="text-[10px] text-muted-foreground">{creator.role}</p>
        </div>
      </div>
    </Card>
  );
}
