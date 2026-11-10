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
      <p className="text-secondary text-xs font-semibold">{t('created-by')}</p>
      <div className="flex items-center gap-3">
        <Avatar className="bg-success size-10 text-white">
          <AvatarFallback className="bg-success text-xs font-semibold text-white">
            {creator.initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-secondary text-xs font-semibold">{creator.name}</p>
          <p className="text-muted-foreground text-[10px]">{creator.role}</p>
        </div>
      </div>
    </Card>
  );
}
