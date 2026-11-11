import type { HomeWhyModel, HomeWhyTone } from '../types/home.types';
import WhyModelCard from './WhyModelCard';
import WhyTagPill from './WhyTagPill';

type WhyModelColumnProps = {
  tone: HomeWhyTone;
  tag: string;
  title: string;
  description: string;
  items: HomeWhyModel[];
};

export default function WhyModelColumn({
  tone,
  tag,
  title,
  description,
  items,
}: WhyModelColumnProps) {
  return (
    <div className="flex min-w-0 flex-col gap-3.5">
      <WhyTagPill tone={tone} className="self-start">
        {tag}
      </WhyTagPill>
      <h3 className="mt-1.5 text-2xl leading-tight font-semibold">{title}</h3>
      <p className="mb-1.5 text-sm leading-relaxed font-light text-why-ink-muted">
        {description}
      </p>
      {items.map((item) => (
        <WhyModelCard key={item.id} tone={tone} item={item} />
      ))}
    </div>
  );
}
