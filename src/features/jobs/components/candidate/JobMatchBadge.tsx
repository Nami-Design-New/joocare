'use client';

import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/lib/utils';
import { Sparkles } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useFormatter, useTranslations } from 'next-intl';

type JobMatchBadgeProps = {
  score?: number | null;
  className?: string;
};

export default function JobMatchBadge({
  score,
  className,
}: JobMatchBadgeProps) {
  const t = useTranslations('jobsPage');
  const format = useFormatter();
  const { data: session } = useSession();

  if (session?.authRole !== 'candidate') return null;

  const matchScore = score ?? 90;

  return (
    <Badge
      variant="open"
      size="md"
      className={cn('gap-1 rounded-lg px-1 font-semibold', className)}
    >
      <Sparkles aria-hidden="true" />
      <span className="sr-only">{t('resume-match')}</span>
      {format.number(matchScore / 100, { style: 'percent' })}
    </Badge>
  );
}
