import type {
  SidebarNavGroup,
  SidebarNavItem,
} from '@/shared/components/sidebar-nav/types';

// Drops links the user cannot open, then empty parents and empty groups.
export function filterSidebarGroups(
  groups: SidebarNavGroup[],
  canAccess: (path: string) => boolean,
): SidebarNavGroup[] {
  return groups
    .map((group) => ({
      ...group,
      items: group.items
        .map(filterSidebarItem(canAccess))
        .filter((item): item is SidebarNavItem => item !== null),
    }))
    .filter((group) => group.items.length > 0);
}

function filterSidebarItem(canAccess: (path: string) => boolean) {
  return (item: SidebarNavItem): SidebarNavItem | null => {
    if (item.children?.length) {
      const children = item.children.filter((child) => canAccess(child.href));
      return children.length ? { ...item, children } : null;
    }
    return item.href && canAccess(item.href) ? item : null;
  };
}
