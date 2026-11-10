import type { SidebarNavItem, SidebarNavLink } from "./types";

const LOCALE_PREFIX = /^\/(?:en|ar)(?=\/|$)/;

export function normalizeSidebarPath(pathname: string) {
  return pathname.replace(LOCALE_PREFIX, "") || "/";
}

function matchesPath(pathname: string, href: string) {
  const normalizedPathname = normalizeSidebarPath(pathname);
  const normalizedHref = normalizeSidebarPath(href).replace(/\/$/, "") || "/";

  return (
    normalizedPathname === normalizedHref ||
    (normalizedHref !== "/" && normalizedPathname.startsWith(`${normalizedHref}/`))
  );
}

export function isSidebarNavLinkActive(
  link: SidebarNavLink,
  pathname: string,
) {
  return [link.href, ...(link.activePaths ?? [])].some((path) =>
    matchesPath(pathname, path),
  );
}

export function isSidebarNavItemActive(
  item: SidebarNavItem,
  pathname: string,
) {
  if (item.children?.length) {
    return item.children.some((child) =>
      isSidebarNavLinkActive(child, pathname),
    );
  }

  return item.href
    ? isSidebarNavLinkActive(
        { href: item.href, activePaths: item.activePaths, label: item.label },
        pathname,
      )
    : false;
}
