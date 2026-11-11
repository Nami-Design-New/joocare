import { useTranslations } from 'next-intl';
import type { ApplyCvState } from '../../hooks/useApplyCv';
import ApplyCvPicker from './ApplyCvPicker';

type ApplyCvStepProps = {
  cv: ApplyCvState;
};

// Step 2 "Upload CV": choose the CV sent with the application.
export default function ApplyCvStep({ cv }: ApplyCvStepProps) {
  const t = useTranslations('jobDetailsPage.apply.cv');

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-foreground">{t('title')}</h3>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>
      <ApplyCvPicker cv={cv} layout="cards" />
    </div>
  );
}
