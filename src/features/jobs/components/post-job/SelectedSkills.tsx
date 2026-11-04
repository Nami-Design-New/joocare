import { CircleX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Option } from '@/shared/components/SelectInputField';

type SelectedSkillsProps = {
  skills: Option[];
  disabled?: boolean;
  onRemove: (value: string) => void;
};

export default function SelectedSkills({
  skills,
  disabled = false,
  onRemove,
}: SelectedSkillsProps) {
  const t = useTranslations('companyPage.postJob.fields.skills');
  if (!skills.length) return null;

  return (
    <section className="bg-primary-bg flex flex-col gap-3 rounded-xl p-4">
      <h3 className="text-primary flex items-center gap-2 text-sm font-semibold">
        {t('selected')}
        <span className="bg-card flex size-6 items-center justify-center rounded-full text-xs">
          {skills.length}
        </span>
      </h3>
      <ul className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <li
            key={skill.value}
            className="border-primary text-primary flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium"
          >
            <button
              type="button"
              disabled={disabled}
              onClick={() => onRemove(skill.value)}
              aria-label={t('remove', { name: skill.label })}
              className="rounded-full focus-visible:outline-2"
            >
              <CircleX aria-hidden className="size-5" strokeWidth={1.5} />
            </button>
            {skill.label}
          </li>
        ))}
      </ul>
    </section>
  );
}
