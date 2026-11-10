import type { LucideIcon } from "lucide-react";

export type SidebarNavLink = {
  label: string;
  href: string;
  /** Additional paths that should activate this link, such as detail routes. */
  activePaths?: readonly string[];
};

export type SidebarNavItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
  activePaths?: readonly string[];
  children?: readonly SidebarNavLink[];
};

export type SidebarNavGroup = {
  title: string;
  items: readonly SidebarNavItem[];
};
