'use client';

import { CustomPagination } from '@/shared/components/CustomPagination';
import { companyMemberRoles } from '../data/members.data';
import { useCompanyMembers } from '../hooks/useCompanyMembers';
import CompanyMemberDialogs from './CompanyMemberDialogs';
import MembersFilters from './MembersFilters';
import MembersTable from './MembersTable';
import CompanyUsersHeader from './CompanyUsersHeader';

export default function CompanyUsersPage() {
  const members = useCompanyMembers();

  return (
    <div className="flex flex-col gap-6 lg:mt-4">
      <CompanyUsersHeader
        count={Math.min(members.filteredMembers.length, members.pageSize)}
        onAdd={members.openAddMember}
        memberModalOpen={members.memberModalOpen}
        editingMember={members.editingMember}
        onCloseModal={members.closeMemberForm}
        onSaveMember={members.saveMember}
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
        deletingMember={members.deletingMemberId !== null}
        onCloseDeleteModal={members.closeDeleteModal}
        onConfirmDelete={members.confirmDeleteMember}
      />
    </div>
  );
}
