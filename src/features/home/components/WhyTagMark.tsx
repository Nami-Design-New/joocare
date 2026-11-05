import { cva } from 'class-variance-authority';
import type { HomeWhyTone } from '../types/home.types';

const tagMarkVariants = cva(
  'size-3 shrink-0 rounded-full border-[1.4px] border-current bg-[radial-gradient(circle,currentColor_0_2.6px,transparent_3.1px)]',
  {
    variants: {
      tone: {
        legacy: 'text-legacy-accent',
        model: 'text-why-green-light',
      },
    },
  },
);

type WhyTagMarkProps = {
  tone: HomeWhyTone;
};

export default function WhyTagMark({ tone }: WhyTagMarkProps) {
  return <span aria-hidden="true" className={tagMarkVariants({ tone })} />;
}
