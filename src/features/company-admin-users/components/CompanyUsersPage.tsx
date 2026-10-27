'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import CountPageHeader from '@/shared/components/common/CountPageHeader';
import { CustomPagination } from '@/shared/components/CustomPagination';
import { companyMemberRoles } from '../data/members.data';
import { useCompanyMembers } from '../hooks/useCompanyMembers';
import CompanyMemberDialogs from './CompanyMemberDialogs';
import MembersFilters from './MembersFilters';
import MembersTable from './MembersTable';

export default function CompanyUsersPage() {
  const t = useTranslations('companyPage.usersManagement');
  const members = useCompanyMembers();

  return (
    <div className="flex flex-col gap-6 lg:mt-4">
      <CountPageHeader
        count={Math.min(members.filteredMembers.length, members.pageSize)}
        title={t('title')}
        action={{
          label: t('addNewMember'),
          icon: <Plus className="size-4" />,
          onClick: members.openAddMember,
        }}
      />

      <MembersFilters
        search={members.search}
        roleFilter={members.roleFilter}
        roles={companyMemberRoles}
        onSearchChange={members.setSearch}
        onRoleChange={members.setRoleFilter}
      />

      <MembersTable
        members={members.visibleMembers}
        page={members.currentPage}
        pageSize={members.pageSize}
        direction={members.direction}
        onEdit={members.openEditMember}
        onDelete={members.requestDeleteMember}
      />

      <CustomPagination
        currentPage={members.currentPage}
        totalItems={members.filteredMembers.length}
        pageSize={members.pageSize}
        onPageChange={members.setCurrentPage}
        statusPosition="start"
        className="md:justify-between"
      />

      <CompanyMemberDialogs
        memberModalOpen={members.memberModalOpen}
        editingMember={members.editingMember}
        deletingMember={members.deletingMemberId !== null}
        onCloseMemberForm={members.closeMemberForm}
        onSaveMember={members.saveMember}
        onCloseDeleteModal={members.closeDeleteModal}
        onConfirmDelete={members.confirmDeleteMember}
      />
    </div>
  );
}
