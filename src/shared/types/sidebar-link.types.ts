import type { LucideIcon } from 'lucide-react';
import type { SidebarNavLink } from '@/shared/components/sidebar-nav/types';

export type SidebarLinkItem = SidebarNavLink & {
  /** Lucide icon rendered when the design has no custom asset. */
  icon?: LucideIcon;
  /** Path of an SVG asset rendered as a mask, so it follows the text color. */
  image?: string;
};
