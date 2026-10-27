'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Card } from '@/shared/components/ui/card';

export default function AssessmentCreatorCard({
  creator,
  categoryId,
}: {
  creator: { name: string; role: string; initials: string };
  categoryId: string;
}) {
  const t = useTranslations('companyPage.assessments.details');

  return (
    <Card className="flex-row items-center gap-3 rounded-2xl border-0 px-4 py-3 shadow-none">
      <Avatar className="bg-success size-10 text-white">
        <AvatarFallback className="bg-success text-xs font-semibold text-white">
          {creator.initials}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="text-muted-foreground text-[9px] uppercase">
          {t('created-by')}
        </p>
        <p className="text-secondary text-xs font-semibold">{creator.name}</p>
        <p className="text-muted-foreground text-[10px]">{creator.role}</p>
      </div>
      <Link
        href={`/company/assessments/${categoryId}`}
        className="text-primary ms-auto text-xs hover:underline"
      >
        {t('back-to-assessments')}
      </Link>
    </Card>
  );
}
