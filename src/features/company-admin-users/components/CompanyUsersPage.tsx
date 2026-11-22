'use client';

import { useTranslations } from 'next-intl';
import { CustomPagination } from '@/shared/components/CustomPagination';
import EmptyDataState from '@/shared/components/EmptyDataState';
import RouteErrorFallback from '@/shared/components/RouteErrorFallback';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { COMPANY_MEMBERS_SKELETON_ROWS } from '../constants';
import { useCompanyMembers } from '../hooks/useCompanyMembers';
import CompanyMemberDialogs from './CompanyMemberDialogs';
import CompanyUsersHeader from './CompanyUsersHeader';
import MembersFilters from './MembersFilters';
import MembersTable from './MembersTable';

export default function CompanyUsersPage() {
  const t = useTranslations('companyPage.usersManagement');
  const members = useCompanyMembers();

  if (members.isError) {
    return (
      <RouteErrorFallback
        error={members.error ?? new Error(t('error-description'))}
        reset={members.retry}
        title={t('error-title')}
        description={t('error-description')}
        retryLabel={t('retry')}
      />
    );
  }

  const renderMembers = () => {
    if (members.isLoading) {
      return (
        <div className="flex flex-col gap-2 rounded-xl bg-white p-3">
          {Array.from({ length: COMPANY_MEMBERS_SKELETON_ROWS }, (_, index) => (
            <Skeleton key={index} className="h-12 rounded-lg" />
          ))}
        </div>
      );
    }
    if (!members.members.length) {
      return <EmptyDataState titleText={t('empty')} />;
    }
    return (
      <>
        <MembersTable
          members={members.members}
          page={members.currentPage}
          pageSize={members.pageSize}
          direction={members.direction}
          onEdit={members.openEditMember}
          onDelete={members.requestDeleteMember}
        />
        <CustomPagination
          currentPage={members.currentPage}
          totalItems={members.total}
          pageSize={members.pageSize}
          onPageChange={members.setCurrentPage}
          statusPosition="start"
          className="md:justify-between"
        />
      </>
    );
  };

  return (
    <div className="flex flex-col gap-6 lg:mt-4">
      <CompanyUsersHeader count={members.total} onAdd={members.openAddMember} />

      <MembersFilters
        search={members.search}
        roleFilter={members.roleFilter}
        roleOptions={members.roleOptions}
        onSearchChange={members.setSearch}
        onRoleChange={members.setRoleFilter}
      />

      {renderMembers()}

      <CompanyMemberDialogs
        memberModalOpen={members.memberModalOpen}
        editingMember={members.editingMember}
        roleOptions={members.roleOptions}
        isSaving={members.isSaving}
        onCloseMemberForm={members.closeMemberForm}
        onSaveMember={members.saveMember}
        deletingMember={members.deletingMember !== null}
        isDeleting={members.isDeleting}
        onCloseDeleteModal={members.closeDeleteModal}
        onConfirmDelete={members.confirmDeleteMember}
      />
    </div>
  );
}
