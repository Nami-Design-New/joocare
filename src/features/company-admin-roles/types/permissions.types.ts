import type { CompanyRole } from './role.types';

export type CompanyRoleKey =
  | 'recruitment_manager'
  | 'recruiter'
  | 'branding_specialist'
  | 'admin'
  | 'hiring_manager';

export type PermissionEntry = {
  id: string;
  label?: string;
  value: string;
  description?: string;
};

export type PermissionNoticeData = {
  title?: string;
  description: string;
};

export type PermissionGroup = {
  id: string;
  title: string;
  description?: string;
  entries: PermissionEntry[];
  highlighted?: boolean;
  note?: string;
  notice?: PermissionNoticeData;
};

export type RolePermissionConfig = {
  description: string;
  groups: PermissionGroup[];
  overviewSuffix?: string;
  notice?: PermissionNoticeData;
};

export type RolePermissionsModalProps = {
  role: CompanyRole;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCloseAutoFocus?: (event: Event) => void;
};
