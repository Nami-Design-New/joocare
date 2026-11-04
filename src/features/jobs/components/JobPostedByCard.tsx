import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import type { JobCreator } from '../types/jobs.types';
import { formatJobDateTime, getInitials } from '../utils';

type JobPostedByCardProps = {
  creator: JobCreator;
  createdAt?: string | null;
};

// "Posted by" card (Figma 11531:102954).
export default function JobPostedByCard({ creator, createdAt }: JobPostedByCardProps) {
  const t = useTranslations('companyPage.jobs.postedBy');
  const locale = useLocale();
  const created = formatJobDateTime(createdAt, locale);

  return (
    <section className="bg-card border-border flex flex-wrap items-center gap-3 rounded-2xl border px-5 py-4">
      {creator.image ? (
        <Image
          src={creator.image}
          alt=""
          width={44}
          height={44}
          className="size-11 shrink-0 rounded-full object-cover"
        />
      ) : (
        <span className="bg-primary-bg text-primary flex size-11 shrink-0 items-center justify-center rounded-full font-semibold">
          {getInitials(creator.name)}
        </span>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-foreground">
          {t('label')} <strong className="font-semibold">{creator.name}</strong>
        </p>
        <p className="text-muted-foreground truncate text-sm">
          {creator.role} · <bdi>{creator.email}</bdi>
        </p>
      </div>
      {created ? (
        <div className="flex flex-col gap-0.5 text-end">
          <span className="text-muted-foreground text-xs">{t('created-on')}</span>
          <time className="text-foreground text-sm font-medium">{created}</time>
        </div>
      ) : null}
    </section>
  );
}
