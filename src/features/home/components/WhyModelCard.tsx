import { cva } from 'class-variance-authority';
import type { HomeWhyModel, HomeWhyTone } from '../types/home.types';
import WhyModelIcon from './WhyModelIcon';

const modelCardVariants = cva(
  'grid grid-cols-[auto_1fr] items-start gap-3.5 rounded-[14px] border bg-linear-to-b p-4',
  {
    variants: {
      tone: {
        legacy: 'border-why-line from-white/[3.2%] to-white/[1.2%]',
        model: 'border-why-green-light/18 from-why-green/7 to-why-green/2',
      },
    },
  },
);

type WhyModelCardProps = {
  tone: HomeWhyTone;
  item: HomeWhyModel;
};

export default function WhyModelCard({ tone, item }: WhyModelCardProps) {
  return (
    <article className={modelCardVariants({ tone })}>
      <WhyModelIcon tone={tone} />
      <div>
        <h4 className="mt-px mb-1 text-[14.5px] leading-snug font-semibold">
          {item.title}
        </h4>
        <p className="text-why-ink-muted text-[12.5px] leading-normal font-light">
          {item.description}
        </p>
      </div>
    </article>
  );
}
