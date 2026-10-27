'use client';

import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import CountPageHeader from '@/shared/components/common/CountPageHeader';
import { CustomPagination } from '@/shared/components/CustomPagination';
import { companyMemberRoles, sampleCompanyMembers } from '../data/members.data';
import type { CompanyMember, CompanyMemberFormValues } from '../types/member.types';
import MembersFilters from './MembersFilters';
import MembersTable from './MembersTable';
import MemberFormModal from './MemberFormModal';
import DeleteModal from '@/shared/components/modals/DeleteModal';

const PAGE_SIZE = 5;

export default function CompanyUsersPage() {
  const t = useTranslations('companyPage.usersManagement');
  const locale = useLocale();
  const [members, setMembers] = useState(sampleCompanyMembers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingMember, setEditingMember] = useState<CompanyMember | null>(null);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [deletingMemberId, setDeletingMemberId] = useState<number | null>(null);

  const filteredMembers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return members.filter((member) => {
      const matchesSearch =
        !normalizedSearch ||
        member.name.toLowerCase().includes(normalizedSearch) ||
        member.email.toLowerCase().includes(normalizedSearch);

      return matchesSearch && (!roleFilter || member.role === roleFilter);
    });
  }, [members, roleFilter, search]);

  const visibleMembers = filteredMembers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleSave = (values: CompanyMemberFormValues) => {
    if (editingMember) {
      setMembers((current) =>
        current.map((member) =>
          member.id === editingMember.id ? { ...member, ...values } : member,
        ),
      );
    } else {
      const nextId = Math.max(0, ...members.map((member) => member.id)) + 1;
      const newMember: CompanyMember = {
        ...values,
        id: nextId,
        date: new Intl.DateTimeFormat(locale, {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        }).format(new Date()),
      };

      setMembers((current) => [newMember, ...current]);
      setCurrentPage(1);
    }
    setMemberModalOpen(false);
    setEditingMember(null);
  };

  const openAddModal = () => {
    setEditingMember(null);
    setMemberModalOpen(true);
  };

  const openEditModal = (member: CompanyMember) => {
    setEditingMember(member);
    setMemberModalOpen(true);
  };

  const handleDeleteMember = (memberId: number) => {
    setMembers((current) => current.filter((member) => member.id !== memberId));
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-6 lg:mt-4">
      <CountPageHeader
        count={Math.min(filteredMembers.length, PAGE_SIZE)}
        title={t('title')}
        action={{
          label: t('addNewMember'),
          icon: <Plus className="size-4" />,
          onClick: openAddModal,
        }}
      />

      <MembersFilters
        search={search}
        roleFilter={roleFilter}
        roles={companyMemberRoles}
        onSearchChange={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        onRoleChange={(value) => {
          setRoleFilter(value);
          setCurrentPage(1);
        }}
      />

      <MembersTable
        members={visibleMembers}
        page={currentPage}
        pageSize={PAGE_SIZE}
        direction={locale === 'ar' ? 'rtl' : 'ltr'}
        onEdit={openEditModal}
        onDelete={setDeletingMemberId}
      />

      <CustomPagination
        currentPage={currentPage}
        totalItems={filteredMembers.length}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
        statusPosition="start"
        className="md:justify-between"
      />

      <MemberFormModal
        key={memberModalOpen ? (editingMember?.id ?? 'new-open') : 'closed'}
        open={memberModalOpen}
        member={editingMember}
        roles={companyMemberRoles}
        onClose={() => setMemberModalOpen(false)}
        onSave={handleSave}
      />

      <DeleteModal
        open={deletingMemberId !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingMemberId(null);
        }}
        title={t('deleteConfirmationTitle')}
        description={t('deleteConfirmationDescription')}
        confirmLabel={t('confirm')}
        cancelLabel={t('cancel')}
        onConfirm={() => {
          if (deletingMemberId !== null) handleDeleteMember(deletingMemberId);
          setDeletingMemberId(null);
        }}
      />
    </div>
  );
}
