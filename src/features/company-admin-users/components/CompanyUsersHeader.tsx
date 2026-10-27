'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import CountPageHeader from '@/shared/components/common/CountPageHeader';
import MemberFormModal from './MemberFormModal';
import { companyMemberRoles } from '../data/members.data';
import type {
  CompanyMember,
  CompanyMemberFormValues,
} from '../types/member.types';

export default function CompanyUsersHeader({
  count,
  onAdd,
  memberModalOpen,
  editingMember,
  onCloseModal,
  onSaveMember,
}: {
  count: number;
  onAdd: () => void;
  memberModalOpen: boolean;
  editingMember: CompanyMember | null;
  onCloseModal: () => void;
  onSaveMember: (values: CompanyMemberFormValues) => void;
}) {
  const t = useTranslations('companyPage.usersManagement');

  return (
    <>
      <CountPageHeader
        count={count}
        title={t('title')}
        action={{
          label: t('addNewMember'),
          icon: <Plus className="size-4" />,
          onClick: onAdd,
        }}
      />
      <MemberFormModal
        key={memberModalOpen ? (editingMember?.id ?? 'new-open') : 'closed'}
        open={memberModalOpen}
        member={editingMember}
        roles={companyMemberRoles}
        onClose={onCloseModal}
        onSave={onSaveMember}
      />
    </>
  );
}
