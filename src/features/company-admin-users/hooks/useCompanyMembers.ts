'use client';

import { useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { sampleCompanyMembers } from '../data/members.data';
import type { CompanyMember, CompanyMemberFormValues } from '../types/member.types';

const PAGE_SIZE = 5;

export function useCompanyMembers() {
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

  const openAddMember = () => {
    setEditingMember(null);
    setMemberModalOpen(true);
  };

  const openEditMember = (member: CompanyMember) => {
    setEditingMember(member);
    setMemberModalOpen(true);
  };

  const saveMember = (values: CompanyMemberFormValues) => {
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

  const confirmDeleteMember = () => {
    if (deletingMemberId === null) return;

    setMembers((current) => current.filter((member) => member.id !== deletingMemberId));
    setCurrentPage(1);
    setDeletingMemberId(null);
  };

  return {
    pageSize: PAGE_SIZE,
    direction: locale === 'ar' ? 'rtl' as const : 'ltr' as const,
    filteredMembers,
    visibleMembers,
    search,
    roleFilter,
    currentPage,
    editingMember,
    memberModalOpen,
    deletingMemberId,
    setCurrentPage,
    setSearch: (value: string) => {
      setSearch(value);
      setCurrentPage(1);
    },
    setRoleFilter: (value: string) => {
      setRoleFilter(value);
      setCurrentPage(1);
    },
    openAddMember,
    openEditMember,
    closeMemberForm: () => setMemberModalOpen(false),
    saveMember,
    requestDeleteMember: setDeletingMemberId,
    closeDeleteModal: () => setDeletingMemberId(null),
    confirmDeleteMember,
  };
}
