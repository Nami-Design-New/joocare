'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { parsePhoneNumber } from 'react-phone-number-input';
import { useDebouncedValue } from '@/features/company-assessments/hooks/useDebouncedValue';
import { useGetCompanyRoles } from '@/features/company-admin-roles/hooks/useGetCompanyRoles';
import {
  COMPANY_MEMBERS_PAGE_SIZE,
  COMPANY_MEMBERS_SEARCH_DEBOUNCE_MS,
} from '../constants';
import type { CompanyAdminPayload, CompanyMember } from '../types/member.types';
import type { TMemberSchema } from '../validation/member-schema';
import { useCreateCompanyAdmin } from './useCreateCompanyAdmin';
import { useDeleteCompanyAdmin } from './useDeleteCompanyAdmin';
import { useGetCompanyAdmins } from './useGetCompanyAdmins';
import { useUpdateCompanyAdmin } from './useUpdateCompanyAdmin';

function toCompanyAdminPayload(
  values: TMemberSchema,
  email: string,
): CompanyAdminPayload {
  const parsedPhone = parsePhoneNumber(values.phoneNumber);

  return {
    name: values.name,
    email,
    phone: parsedPhone?.nationalNumber ?? '',
    phone_code: parsedPhone ? `+${parsedPhone.countryCallingCode}` : '',
    role: values.role,
    display_role: values.displayedRoleName,
  };
}

export function useCompanyMembers() {
  const locale = useLocale();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingMember, setEditingMember] = useState<CompanyMember | null>(
    null,
  );
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [deletingMember, setDeletingMember] = useState<CompanyMember | null>(
    null,
  );
  const debouncedSearch = useDebouncedValue(
    search,
    COMPANY_MEMBERS_SEARCH_DEBOUNCE_MS,
  );

  const membersQuery = useGetCompanyAdmins({
    page: currentPage,
    search: debouncedSearch,
    role: roleFilter,
  });
  const rolesQuery = useGetCompanyRoles();
  const createMember = useCreateCompanyAdmin();
  const updateMember = useUpdateCompanyAdmin();
  const deleteMember = useDeleteCompanyAdmin();

  const members = membersQuery.data?.members ?? [];
  const roleOptions = (rolesQuery.data ?? []).map((role) => ({
    label: role.name,
    value: role.key,
  }));

  const closeMemberForm = () => {
    setMemberModalOpen(false);
    setEditingMember(null);
  };

  const saveMember = (values: TMemberSchema) => {
    if (editingMember) {
      updateMember.mutate(
        {
          memberId: editingMember.id,
          payload: toCompanyAdminPayload(values, editingMember.email),
        },
        { onSuccess: closeMemberForm },
      );
      return;
    }

    createMember.mutate(toCompanyAdminPayload(values, values.email), {
      onSuccess: () => {
        closeMemberForm();
        setCurrentPage(1);
      },
    });
  };

  const confirmDeleteMember = () => {
    if (!deletingMember) return;

    deleteMember.mutate(deletingMember.id, {
      onSuccess: () => {
        setDeletingMember(null);
        if (members.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      },
    });
  };

  return {
    direction: locale === 'ar' ? ('rtl' as const) : ('ltr' as const),
    members,
    total: membersQuery.data?.total ?? 0,
    pageSize: membersQuery.data?.perPage ?? COMPANY_MEMBERS_PAGE_SIZE,
    isLoading: membersQuery.isPending,
    isError: membersQuery.isError,
    error: membersQuery.error,
    retry: () => void membersQuery.refetch(),
    roleOptions,
    search,
    roleFilter,
    currentPage,
    editingMember,
    memberModalOpen,
    deletingMember,
    isSaving: createMember.isPending || updateMember.isPending,
    isDeleting: deleteMember.isPending,
    setCurrentPage,
    setSearch: (value: string) => {
      setSearch(value);
      setCurrentPage(1);
    },
    setRoleFilter: (value: string) => {
      setRoleFilter(value);
      setCurrentPage(1);
    },
    openAddMember: () => {
      setEditingMember(null);
      setMemberModalOpen(true);
    },
    openEditMember: (member: CompanyMember) => {
      setEditingMember(member);
      setMemberModalOpen(true);
    },
    closeMemberForm,
    saveMember,
    requestDeleteMember: setDeletingMember,
    closeDeleteModal: () => setDeletingMember(null),
    confirmDeleteMember,
  };
}
