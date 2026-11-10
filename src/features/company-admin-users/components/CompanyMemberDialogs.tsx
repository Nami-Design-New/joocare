'use client';

import { useTranslations } from 'next-intl';
import DeleteModal from '@/shared/components/modals/DeleteModal';

type CompanyMemberDialogsProps = {
  deletingMember: boolean;
  onCloseDeleteModal: () => void;
  onConfirmDelete: () => void;
};

export default function CompanyMemberDialogs({
  deletingMember,
  onCloseDeleteModal,
  onConfirmDelete,
}: CompanyMemberDialogsProps) {
  const t = useTranslations('companyPage.usersManagement');

  return (
    <>
      <DeleteModal
        open={deletingMember}
        onOpenChange={(open) => {
          if (!open) onCloseDeleteModal();
        }}
        title={t('deleteConfirmationTitle')}
        description={t('deleteConfirmationDescription')}
        confirmLabel={t('confirm')}
        cancelLabel={t('cancel')}
        onConfirm={onConfirmDelete}
      />
    </>
  );
}
