import Image from 'next/image';
import { useTranslations } from 'next-intl';
import ModalHeading from '@/shared/components/modals/ModalHeading';
import { Button } from '@/shared/components/ui/button';
import { DialogClose } from '@/shared/components/ui/dialog';
import RoleSummaryCard from './RoleSummaryCard';

type RolePermissionsHeaderProps = {
  roleName: string;
  description?: string;
};

export default function RolePermissionsHeader({
  roleName,
  description,
}: RolePermissionsHeaderProps) {
  const t = useTranslations('companyPage.roles.permissions');

  return (
    <div className="border-border flex shrink-0 flex-col gap-6 border-b px-5 pt-5 pb-6 sm:px-8 sm:pt-8">
      <div className="flex items-start gap-6">
        <ModalHeading
          title={t('title')}
          description={t('description')}
          className="min-w-0 flex-1 text-start sm:text-start"
        />
        <DialogClose asChild>
          <Button
            type="button"
            variant="ghost"
            className="bg-muted size-9 rounded-full p-0"
            aria-label={t('close')}
          >
            <Image
              src="/assets/icons/permissions/close.svg"
              width={20}
              height={20}
              alt=""
            />
          </Button>
        </DialogClose>
      </div>
      <RoleSummaryCard name={roleName} description={description} />
    </div>
  );
}
