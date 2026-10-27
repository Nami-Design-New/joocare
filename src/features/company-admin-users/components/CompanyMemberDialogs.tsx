'use client';

import { useTranslations } from 'next-intl';
import DeleteModal from '@/shared/components/modals/DeleteModal';
import { companyMemberRoles } from '../data/members.data';
import type { CompanyMember, CompanyMemberFormValues } from '../types/member.types';
import MemberFormModal from './MemberFormModal';

type CompanyMemberDialogsProps = {
  memberModalOpen: boolean;
  editingMember: CompanyMember | null;
  deletingMember: boolean;
  onCloseMemberForm: () => void;
  onSaveMember: (values: CompanyMemberFormValues) => void;
  onCloseDeleteModal: () => void;
  onConfirmDelete: () => void;
};

export default function CompanyMemberDialogs({
  memberModalOpen,
  editingMember,
  deletingMember,
  onCloseMemberForm,
  onSaveMember,
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
        roles={companyMemberRoles}
        onClose={onCloseMemberForm}
        onSave={onSaveMember}
      />

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
