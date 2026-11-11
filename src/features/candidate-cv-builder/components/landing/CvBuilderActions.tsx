import { cva } from 'class-variance-authority';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import {
  CV_BUILDER_ICONS,
  CV_BUILDER_MODE_BY_STATE,
  CV_BUILDER_ROUTES,
} from '../../constants';
import type { CvBuilderState } from '../../types/cv-builder.types';

const actionVariants = cva('h-12.5 gap-2 px-5 text-sm font-semibold sm:px-8', {
  variants: {
    tone: {
      primary:
        'bg-cv-builder-primary text-primary-foreground hover:bg-cv-builder-primary/90',
      outline: 'h-13 border-secondary text-secondary',
      danger:
        'h-13 border-cv-builder-danger text-cv-builder-danger hover:bg-cv-builder-danger/5 hover:text-cv-builder-danger',
    },
  },
});

type CvBuilderActionsProps = {
  state: CvBuilderState;
  onShowCv: () => void;
  onDeleteDraft: () => void;
};

// Landing buttons for each CV builder state.
export default function CvBuilderActions({
  state,
  onShowCv,
  onDeleteDraft,
}: CvBuilderActionsProps) {
  const t = useTranslations('candidatePage.buildCv');
  const mode = CV_BUILDER_MODE_BY_STATE[state];
  const createHref =
    mode === 'new'
      ? CV_BUILDER_ROUTES.create
      : `${CV_BUILDER_ROUTES.create}?mode=${mode}`;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {state === 'exists' && (
        <Button
          variant="outline"
          size="pill"
          onClick={onShowCv}
          className={actionVariants({ tone: 'outline' })}
        >
          <Image src={CV_BUILDER_ICONS.eye} alt="" width={20} height={20} />
          {t('show-cv')}
        </Button>
      )}
      {state === 'draft' && (
        <Button
          variant="outline"
          size="pill"
          onClick={onDeleteDraft}
          className={actionVariants({ tone: 'danger' })}
        >
          <Image src={CV_BUILDER_ICONS.trash} alt="" width={20} height={20} />
          {t('delete-draft')}
        </Button>
      )}
      <Button
        asChild
        size="pill"
        className={actionVariants({ tone: 'primary' })}
      >
        <Link href={createHref}>{t(`primary-action.${state}`)}</Link>
      </Button>
    </div>
  );
}
