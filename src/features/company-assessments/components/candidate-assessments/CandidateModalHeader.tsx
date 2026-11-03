import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import {
  DialogClose,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';

type CandidateModalHeaderProps = {
  title: string;
  disabled?: boolean;
};

export default function CandidateModalHeader({
  title,
  disabled = false,
}: CandidateModalHeaderProps) {
  const t = useTranslations('companyPage.assessments.candidate-assessments');

  return (
    <DialogHeader className="flex-row items-center justify-between gap-4 text-start">
      <DialogTitle className="text-xl font-bold sm:text-[28px]">
        {title}
      </DialogTitle>
      <DialogClose asChild>
        <Button
          size="icon-circle"
          aria-label={t('close')}
          disabled={disabled}
          className="shrink-0"
        >
          <X aria-hidden className="size-5" />
        </Button>
      </DialogClose>
    </DialogHeader>
  );
}
