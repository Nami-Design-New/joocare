'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import EmptyDataState from '@/shared/components/EmptyDataState';
import RouteErrorFallback from '@/shared/components/RouteErrorFallback';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { rolePermissions } from '../data/permissions.data';
import { useGetCompanyRoles } from '../hooks/useGetCompanyRoles';
import type { CompanyRole } from '../types/role.types';
import RolePermissionsModals from './modals/RolePermissionsModals';
import RolesTable from './RolesTable';
import RolesPageHeader from './RolesPageHeader';

const ROLES_SKELETON_ROWS = 5;

export default function RolesPage() {
  const t = useTranslations('companyPage.roles');
  const rolesQuery = useGetCompanyRoles();
  const roles = rolesQuery.data ?? [];
  const [selectedRole, setSelectedRole] = useState<CompanyRole | null>(null);
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const handleShowPermissions = (
    role: CompanyRole,
    trigger: HTMLButtonElement,
  ) => {
    if (!Object.prototype.hasOwnProperty.call(rolePermissions, role.key)) {
      toast.error(t('permissions.unavailable'));
      return;
    }
    triggerRef.current = trigger;
    setSelectedRole(role);
    setPermissionsOpen(true);
  };

  const handleCloseAutoFocus = (event: Event) => {
    event.preventDefault();
    triggerRef.current?.focus();
  };

  if (rolesQuery.isError) {
    return (
      <RouteErrorFallback
        error={rolesQuery.error}
        reset={() => void rolesQuery.refetch()}
        title={t('error-title')}
        description={t('error-description')}
        retryLabel={t('retry')}
      />
    );
  }

  const renderContent = () => {
    if (rolesQuery.isPending) {
      return (
        <div className="flex flex-col gap-2 rounded-xl bg-white p-3">
          {Array.from({ length: ROLES_SKELETON_ROWS }, (_, index) => (
            <Skeleton key={index} className="h-12 rounded-lg" />
          ))}
        </div>
      );
    }
    if (!roles.length) {
      return <EmptyDataState titleText={t('empty')} />;
    }
    return (
      <RolesTable roles={roles} onShowPermissions={handleShowPermissions} />
    );
  };

  return (
    <div className="flex flex-col gap-6 lg:mt-4">
      <RolesPageHeader count={roles.length} />
      {renderContent()}
      {selectedRole ? (
        <RolePermissionsModals
          role={selectedRole}
          open={permissionsOpen}
          onOpenChange={setPermissionsOpen}
          onCloseAutoFocus={handleCloseAutoFocus}
        />
      ) : null}
    </div>
  );
}
