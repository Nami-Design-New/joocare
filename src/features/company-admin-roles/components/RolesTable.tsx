import DataTable, {
  type DataTableColumn,
} from '@/shared/components/common/DataTable';
import { Button } from '@/shared/components/ui/button';
import { Eye } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import type { CompanyRole } from '../types/role.types';

type RolesTableProps = {
  roles: CompanyRole[];
  onShowPermissions: (role: CompanyRole, trigger: HTMLButtonElement) => void;
};

export default function RolesTable({
  roles,
  onShowPermissions,
}: RolesTableProps) {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const columns: DataTableColumn<CompanyRole>[] = [
    {
      id: 'number',
      header: '#',
      headerClassName: 'w-[50px]',
      cellClassName: 'w-[50px]',
      renderCell: (role) => `#${role.id}`,
    },
    {
      id: 'role-name',
      header: t('companyPage.roles.roleName'),
      renderCell: (role) => role.name,
    },
    {
      id: 'members',
      header: t('companyPage.roles.members'),
      renderCell: (role) => role.memberCount,
    },
    {
      id: 'actions',
      header: t('companyPage.roles.actions'),
      renderCell: (role) => (
        <Button
          type="button"
          onClick={(event) => onShowPermissions(role, event.currentTarget)}
          size="sm"
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-8 rounded-full px-4 text-xs font-normal"
          aria-label={`${t('companyPage.roles.showPermissions')} - ${role.name}`}
        >
          <Eye className="size-4" aria-hidden="true" />
          {t('companyPage.roles.showPermissions')}
        </Button>
      ),
    },
  ];

  return (
    <div className="w-full">
      <section
        className="w-full rounded-xl bg-white p-3"
        aria-label={t('companyPage.roles.title')}
      >
        <DataTable
          columns={columns}
          data={roles}
          getRowKey={(role) => role.id}
          dir={isRtl ? 'rtl' : 'ltr'}
          headerRowClassName="border-border rounded-t-lg bg-muted hover:bg-muted"
          rowClassName="border-border bg-primary/[0.02] hover:bg-primary/[0.04]"
        />
      </section>
    </div>
  );
}
