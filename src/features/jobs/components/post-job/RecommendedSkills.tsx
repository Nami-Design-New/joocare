import { LoaderCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Option } from '@/shared/components/SelectInputField';
import { Button } from '@/shared/components/ui/button';

type RecommendedSkillsProps = {
  skills: Option[];
  canShowMore: boolean;
  isLoadingMore: boolean;
  disabled?: boolean;
  onSelect: (value: string) => void;
  onShowMore: () => void;
};

export default function RecommendedSkills({
  skills,
  canShowMore,
  isLoadingMore,
  disabled = false,
  onSelect,
  onShowMore,
}: RecommendedSkillsProps) {
  const t = useTranslations('companyPage.postJob.fields.skills');
  if (!skills.length && !canShowMore) return null;

  return (
    <section className="rounded-xl bg-muted p-3">
      <div className="flex flex-col gap-4 rounded-2xl bg-body-bg p-4">
        <h3 className="text-base">{t('recommended')}</h3>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <button
              key={skill.value}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(skill.value)}
              aria-label={t('add', { name: skill.label })}
              className="rounded-2xl border border-border px-4 py-2 text-base transition-colors hover:border-primary hover:text-primary"
            >
              {skill.label}
            </button>
          ))}
          {canShowMore && (
            <Button
              type="button"
              size="sm"
              disabled={disabled || isLoadingMore}
              onClick={onShowMore}
              className="h-auto rounded-2xl px-4 py-2 text-base font-normal"
            >
              {isLoadingMore && (
                <LoaderCircle aria-hidden className="size-4 animate-spin" />
              )}
              {t('show-more')}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
