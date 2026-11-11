import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import { DialogClose, DialogFooter } from '@/shared/components/ui/dialog';

export default function RolePermissionsFooter() {
  const t = useTranslations('companyPage.roles.permissions');

  return (
    <DialogFooter className="flex shrink-0 flex-row flex-wrap items-center justify-between gap-4 border-t border-border bg-primary/[0.02] px-5 py-5 sm:justify-between sm:gap-6 sm:px-8">
      <p className="min-w-0 flex-1 text-sm leading-[normal] text-muted-foreground">
        {t('readOnly')}
      </p>
      <DialogClose asChild>
        <Button
          type="button"
          variant="secondary"
          size="pill"
          className="h-[50px] w-[120px] text-sm font-semibold"
        >
          {t('close')}
        </Button>
      </DialogClose>
    </DialogFooter>
  );
}
