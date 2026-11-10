'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import DataTable, { type DataTableColumn } from '@/shared/components/common/DataTable';
import { Button } from '@/shared/components/ui/button';
import type { CompanyMember } from '../types/member.types';

type MembersTableProps = {
  members: CompanyMember[];
  page: number;
  pageSize: number;
  direction: 'ltr' | 'rtl';
  onEdit: (member: CompanyMember) => void;
  onDelete: (memberId: number) => void;
};

export default function MembersTable({
  members,
  page,
  pageSize,
  direction,
  onEdit,
  onDelete,
}: MembersTableProps) {
  const t = useTranslations('companyPage.usersManagement');
  const columns: DataTableColumn<CompanyMember>[] = [
    {
      id: 'number',
      header: '#',
      headerClassName: 'w-10 text-start',
      cellClassName: 'w-10 text-start font-semibold',
      renderCell: (_member, index) => `#${(page - 1) * pageSize + index + 1}`,
    },
    {
      id: 'name',
      header: t('columns.name'),
      headerClassName: 'min-w-44 text-start',
      cellClassName: 'max-w-48 text-start',
      renderCell: (member) => <span className="block truncate">{member.name}</span>,
    },
    {
      id: 'email',
      header: t('columns.email'),
      headerClassName: 'min-w-36',
      cellClassName: 'max-w-36',
      renderCell: (member) => <span className="block truncate">{member.email}</span>,
    },
    {
      id: 'phone',
      header: t('columns.phone'),
      headerClassName: 'min-w-32',
      cellClassName: 'min-w-32 whitespace-nowrap',
      renderCell: (member) => member.phone,
    },
    {
      id: 'date',
      header: t('columns.date'),
      headerClassName: 'min-w-28',
      cellClassName: 'min-w-28 text-xs text-muted-foreground',
      renderCell: (member) => member.date,
    },
    {
      id: 'role',
      header: t('columns.role'),
      headerClassName: 'min-w-24',
      cellClassName: 'min-w-24',
      renderCell: (member) => member.role,
    },
    {
      id: 'displayed-role',
      header: t('columns.displayedRoleName'),
      headerClassName: 'min-w-36',
      cellClassName: 'min-w-36',
      renderCell: (member) => member.displayedRoleName,
    },
    {
      id: 'actions',
      header: t('columns.actions'),
      headerClassName: 'min-w-40',
      cellClassName: 'min-w-40',
      renderCell: (member) => (
        <div className="flex items-center justify-center gap-1.5">
          <Button
            type="button"
            size="sm"
            onClick={() => onEdit(member)}
            className="h-8 rounded-full bg-secondary px-3 text-xs text-white hover:bg-secondary/90"
            aria-label={`${t('edit')} ${member.name}`}
          >
            <Pencil className="size-3" />
            {t('edit')}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={() => onDelete(member.id)}
            className="h-8 rounded-full px-3 text-xs"
            aria-label={`${t('delete')} ${member.name}`}
          >
            <Trash2 className="size-3" />
            {t('delete')}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-xl bg-white p-2 sm:p-3">
      <DataTable
        columns={columns}
        data={members}
        getRowKey={(member) => member.id}
        dir={direction}
        ariaLabel={t('title')}
        containerClassName="rounded-lg bg-[#f8faf8]"
        className="min-w-[1000px] [&_th]:text-base [&_td]:text-[15px]"
        headerRowClassName="bg-[#f3f4f3]"
        rowClassName="border-b border-[#e6e8e6] last:border-0"
      />
    </div>
  );
}
