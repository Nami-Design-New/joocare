'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import CountPageHeader from '@/shared/components/common/CountPageHeader';
import { sampleCompanyRoles } from '../data/roles.data';
import { rolePermissions } from '../data/permissions.data';
import type { CompanyRole } from '../types/role.types';
import RolePermissionsModals from './modals/RolePermissionsModals';
import RolesTable from './RolesTable';

export default function RolesPage() {
  const t = useTranslations('companyPage.roles');
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

  return (
    <div className="flex flex-col gap-6 lg:mt-4">
      <CountPageHeader count={sampleCompanyRoles.length} title={t('title')} />
      <RolesTable
        roles={sampleCompanyRoles}
        onShowPermissions={handleShowPermissions}
      />
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
