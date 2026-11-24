import {
  COMPANY_ROLE_ACCESS,
  UNKNOWN_ROLE_ACCESS,
} from '../constants/company-role-access';
import type {
  CompanyAction,
  CompanyRoleAccess,
} from '../types/company-role-access.types';

const FULL_ACCESS = COMPANY_ROLE_ACCESS.recruitment_manager;

function isKnownRole(role: string): role is keyof typeof COMPANY_ROLE_ACCESS {
  return Object.prototype.hasOwnProperty.call(COMPANY_ROLE_ACCESS, role);
}

// Sessions created before the role was stored have no role; they keep full
// access until the next login. The backend still checks every request.
export function getCompanyRoleAccess(role?: string | null): CompanyRoleAccess {
  if (!role) return FULL_ACCESS;
  return isKnownRole(role) ? COMPANY_ROLE_ACCESS[role] : UNKNOWN_ROLE_ACCESS;
}

function matchesRoute(path: string, route: string) {
  return path === route || path.startsWith(`${route}/`);
}

/** `path` has no locale prefix, e.g. `/company/users`. */
export function canAccessCompanyPath(
  role: string | null | undefined,
  path: string,
) {
  const { routes } = getCompanyRoleAccess(role);
  if (routes === 'all') return true;
  return routes.some((route) => matchesRoute(path, route));
}

export function canDoCompanyAction(
  role: string | null | undefined,
  action: CompanyAction,
) {
  const { actions } = getCompanyRoleAccess(role);
  return actions === 'all' || actions.includes(action);
}

export function getCompanyRoleHome(role?: string | null) {
  return getCompanyRoleAccess(role).home;
}
