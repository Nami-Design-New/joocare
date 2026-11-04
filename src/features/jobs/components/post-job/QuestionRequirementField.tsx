import { useTranslations } from 'next-intl';
import SegmentedPills from './SegmentedPills';

type QuestionRequirementFieldProps = {
  name: string;
  required: boolean;
  onChange: (required: boolean) => void;
};

// "Is this question required?" (Figma component 11531:115393).
export default function QuestionRequirementField({
  name,
  required,
  onChange,
}: QuestionRequirementFieldProps) {
  const t = useTranslations('companyPage.postJob.questions');

  return (
    <div className="flex flex-col gap-3">
      <p className="flex flex-wrap items-baseline gap-x-2">
        <span className="text-foreground font-semibold">{t('requirement-title')}</span>
        <span className="text-muted-foreground text-sm">{t('requirement-description')}</span>
      </p>
      <SegmentedPills
        name={name}
        label={t('requirement-title')}
        value={required ? 'required' : 'optional'}
        onChange={(value) => onChange(value === 'required')}
        options={[
          { value: 'required', label: t('required') },
          { value: 'optional', label: t('optional') },
        ]}
      />
    </div>
  );
}
