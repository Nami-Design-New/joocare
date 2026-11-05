'use client';

import type { CSSProperties } from 'react';
import { cva } from 'class-variance-authority';
import { useTranslations } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/shared/lib/utils';
import type { SidebarLinkItem } from '@/shared/types/sidebar-link.types';
import { isSidebarNavLinkActive } from './sidebar-nav/utils';

type SidebarLinkVariant = 'pill' | 'menu';

type SidebarLinksProps = {
  links: readonly SidebarLinkItem[];
  /** Links pinned to the bottom of the desktop sidebar. */
  bottomLinks?: readonly SidebarLinkItem[];
};

type SidebarLinkProps = {
  link: SidebarLinkItem;
  isActive: boolean;
  variant: SidebarLinkVariant;
};

type SidebarLinkListProps = {
  links: readonly SidebarLinkItem[];
  pathname: string;
  className?: string;
};

const sidebarLinkVariants = cva(
  'group flex items-center font-semibold transition-colors',
  {
    variants: {
      variant: {
        pill: 'gap-2 rounded-full border px-4 py-2 text-sm whitespace-nowrap',
        menu: 'gap-3 rounded-2xl py-1 ps-1 pe-2 text-base',
      },
      active: {
        true: 'bg-primary-bg text-primary',
        false: 'text-muted-foreground hover:bg-primary-bg hover:text-primary',
      },
    },
    compoundVariants: [
      { variant: 'pill', active: true, className: 'border-primary' },
      {
        variant: 'pill',
        active: false,
        className: 'border-border hover:border-primary',
      },
    ],
  },
);

const sidebarLinkIconBoxVariants = cva(
  'flex shrink-0 items-center justify-center transition-colors',
  {
    variants: {
      variant: {
        pill: 'size-4',
        menu: 'size-9 rounded-xl',
      },
      active: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'menu',
        active: true,
        className: 'bg-primary text-primary-foreground',
      },
      {
        variant: 'menu',
        active: false,
        className:
          'bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground',
      },
    ],
  },
);

const getMaskStyle = (image: string): CSSProperties => ({
  WebkitMaskImage: `url(${image})`,
  maskImage: `url(${image})`,
});

function SidebarLink({ link, isActive, variant }: SidebarLinkProps) {
  const { href, label, image, icon: Icon } = link;
  const glyphClassName = variant === 'menu' ? 'size-5' : 'size-4';

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={sidebarLinkVariants({ variant, active: isActive })}
    >
      <span
        aria-hidden="true"
        className={sidebarLinkIconBoxVariants({ variant, active: isActive })}
      >
        {image ? (
          <span
            className={cn(
              'block bg-current mask-contain mask-center mask-no-repeat',
              glyphClassName,
            )}
            style={getMaskStyle(image)}
          />
        ) : Icon ? (
          <Icon className={glyphClassName} />
        ) : null}
      </span>
      <span>{label}</span>
    </Link>
  );
}

function SidebarLinkList({ links, pathname, className }: SidebarLinkListProps) {
  return (
    <ul className={cn('flex flex-col gap-5', className)}>
      {links.map((link) => (
        <li key={link.href}>
          <SidebarLink
            link={link}
            variant="menu"
            isActive={isSidebarNavLinkActive(link, pathname)}
          />
        </li>
      ))}
    </ul>
  );
}

export default function SidebarLinks({
  links,
  bottomLinks = [],
}: SidebarLinksProps) {
  const t = useTranslations('common');
  const pathname = usePathname();
  const allLinks = [...links, ...bottomLinks];

  return (
    <>
      <nav aria-label={t('sidebar-navigation')} className="lg:hidden">
        <Swiper
          modules={[FreeMode]}
          spaceBetween={8}
          slidesPerView="auto"
          freeMode
          className="pb-1"
        >
          {allLinks.map((link) => (
            <SwiperSlide key={link.href} className="w-auto!">
              <SidebarLink
                link={link}
                variant="pill"
                isActive={isSidebarNavLinkActive(link, pathname)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </nav>

      <nav
        aria-label={t('sidebar-navigation')}
        className="hidden flex-1 flex-col justify-between gap-5 lg:flex"
      >
        <SidebarLinkList links={links} pathname={pathname} />
        {bottomLinks.length > 0 && (
          <SidebarLinkList
            links={bottomLinks}
            pathname={pathname}
            className="gap-2"
          />
        )}
      </nav>
    </>
  );
}
