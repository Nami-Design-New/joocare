'use client';

import { useTranslations } from 'next-intl';
import DeleteModal from '@/shared/components/modals/DeleteModal';
import type { Option } from '@/shared/components/SelectInputField';
import type { CompanyMember } from '../types/member.types';
import type { TMemberSchema } from '../validation/member-schema';
import MemberFormModal from './MemberFormModal';

type CompanyMemberDialogsProps = {
  memberModalOpen: boolean;
  editingMember: CompanyMember | null;
  roleOptions: Option[];
  isSaving: boolean;
  onCloseMemberForm: () => void;
  onSaveMember: (values: TMemberSchema) => void;
  deletingMember: boolean;
  isDeleting: boolean;
  onCloseDeleteModal: () => void;
  onConfirmDelete: () => void;
};

export default function CompanyMemberDialogs({
  memberModalOpen,
  editingMember,
  roleOptions,
  isSaving,
  onCloseMemberForm,
  onSaveMember,
  deletingMember,
  isDeleting,
  onCloseDeleteModal,
  onConfirmDelete,
}: CompanyMemberDialogsProps) {
  const t = useTranslations('companyPage.usersManagement');

  return (
    <>
      <MemberFormModal
        key={memberModalOpen ? (editingMember?.id ?? 'new-open') : 'closed'}
        open={memberModalOpen}
        member={editingMember}
        roleOptions={roleOptions}
        isSaving={isSaving}
        onClose={onCloseMemberForm}
        onSave={onSaveMember}
      />
      <DeleteModal
        open={deletingMember}
        onOpenChange={(open) => {
          if (!open && !isDeleting) onCloseDeleteModal();
        }}
        title={t('deleteConfirmationTitle')}
        description={t('deleteConfirmationDescription')}
        confirmLabel={t('confirm')}
        cancelLabel={t('cancel')}
        isLoading={isDeleting}
        onConfirm={onConfirmDelete}
      />
    </>
  );
}
