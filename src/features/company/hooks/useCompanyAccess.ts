'use client';

import { useSession } from 'next-auth/react';
import type { CompanyAction } from '../types/company-role-access.types';
import {
  canAccessCompanyPath,
  canDoCompanyAction,
} from '../utils/company-role-access';

// Role of the logged-in company admin, saved in the session at login.
export function useCompanyAccess() {
  const { data: session } = useSession();
  const role = session?.companyRole;

  return {
    role,
    canAccess: (path: string) => canAccessCompanyPath(role, path),
    can: (action: CompanyAction) => canDoCompanyAction(role, action),
  };
}
