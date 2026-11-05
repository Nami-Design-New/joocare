import { cn } from '@/shared/lib/utils';
import type { HomeWhyTone } from '../types/home.types';

type WhyModelIconStyle = {
  ring: string;
  core: string;
  mark: string;
  markPath: string;
};

const ICON_STYLES: Record<HomeWhyTone, WhyModelIconStyle> = {
  legacy: {
    ring: 'stroke-legacy-accent/45',
    core: 'fill-legacy-accent/10 stroke-legacy-accent/35',
    mark: 'stroke-legacy-accent-light',
    markPath: 'M13.6 13.6l6.8 6.8M20.4 13.6l-6.8 6.8',
  },
  model: {
    ring: 'stroke-why-green-light/50',
    core: 'fill-why-green/16 stroke-why-green-light/40',
    mark: 'stroke-why-mint',
    markPath: 'M12.8 17.2l3 3 5.6-5.8',
  },
};

type WhyModelIconProps = {
  tone: HomeWhyTone;
};

export default function WhyModelIcon({ tone }: WhyModelIconProps) {
  const style = ICON_STYLES[tone];

  return (
    <svg
      viewBox="0 0 34 34"
      aria-hidden="true"
      className="size-[34px] shrink-0"
    >
      <circle
        cx="17"
        cy="17"
        r="15.5"
        strokeWidth="1.2"
        className={cn('fill-none', style.ring)}
      />
      <circle cx="17" cy="17" r="11" strokeWidth="1" className={style.core} />
      <path
        d={style.markPath}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn('fill-none', style.mark)}
      />
    </svg>
  );
}
