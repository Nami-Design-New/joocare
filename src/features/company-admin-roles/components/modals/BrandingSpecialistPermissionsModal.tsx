'use client';

import { useLocale } from 'next-intl';
import { Dialog, DialogContent } from '@/shared/components/ui/dialog';
import {
  permissionBodyClassName,
  permissionModalClassName,
} from '../../constants';
import { RolePermissionsModalProps } from '../../types/permissions.types';
import { rolePermissions } from '../../data/permissions.data';
import PermissionGroupCard from '../shared/PermissionGroupCard';
import PermissionsOverview from '../shared/PermissionsOverview';
import RolePermissionsFooter from '../shared/RolePermissionsFooter';
import RolePermissionsHeader from '../shared/RolePermissionsHeader';
import PermissionNotice from '../shared/PermissionNotice';

export default function BrandingSpecialistPermissionsModal({
  role,
  open,
  onOpenChange,
  onCloseAutoFocus,
}: RolePermissionsModalProps) {
  const locale = useLocale();
  const config = rolePermissions['branding-specialist'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={permissionModalClassName}
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
        onCloseAutoFocus={onCloseAutoFocus}
      >
        <RolePermissionsHeader
          roleName={role.name}
          description={config.description}
        />
        <div className={permissionBodyClassName}>
          <PermissionsOverview
            count={config.groups.length}
            suffix={config.overviewSuffix}
          />
          <PermissionGroupCard group={config.groups[0]} />
          {config.notice ? <PermissionNotice {...config.notice} /> : null}
        </div>
        <RolePermissionsFooter />
      </DialogContent>
    </Dialog>
  );
}
