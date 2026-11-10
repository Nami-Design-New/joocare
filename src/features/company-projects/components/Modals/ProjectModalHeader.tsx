import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import {
  DialogClose as ModalClose,
  DialogHeader as ModalHeader,
  DialogTitle as ModalTitle,
} from '@/shared/components/ui/dialog';
import { cn } from '@/shared/lib/utils';

type ProjectModalHeaderProps = {
  title: string;
  disabled?: boolean;
  className?: string;
};

export default function ProjectModalHeader({
  title,
  disabled = false,
  className,
}: ProjectModalHeaderProps) {
  const t = useTranslations('companyPage.projects');

  return (
    <ModalHeader
      className={cn(
        'flex-row items-center justify-between gap-4 text-start',
        className,
      )}
    >
      <ModalTitle className="text-xl font-bold sm:text-[28px]">
        {title}
      </ModalTitle>
      <ModalClose asChild>
        <Button
          size="icon-circle"
          aria-label={t('close')}
          disabled={disabled}
          className="shrink-0"
        >
          <X aria-hidden className="size-5" />
        </Button>
      </ModalClose>
    </ModalHeader>
  );
}
