import Image from 'next/image';
import type { HomeWhyModel } from '../types/home.types';
import SectionTitle from './SectionTitle';
import { useTranslations } from 'next-intl';

export default function Cons({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: HomeWhyModel[];
}) {
  const t = useTranslations();

  return (
    <div className="">
      <SectionTitle sectionTitle={t('home.legacy-model')} />
      <h3 className="mt-2 text-base font-semibold text-secondary md:text-xl">
        {title}
      </h3>
      <p className="text-4 mt-6 mb-10 text-sm text-muted-foreground md:text-base">
        {description}
      </p>
      <ul className="flex flex-col items-start gap-8">
        {items.map((item) => (
          <li key={item.id} className="flex gap-7">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary md:h-12 md:w-12">
              <Image
                src={item.icon as string}
                alt="icon"
                width={18}
                height={18}
              />
            </div>
            <div>
              <h4 className="my-2 text-base font-semibold md:text-xl">
                {item.title}
              </h4>
              <p className="text-sm font-normal text-muted-foreground md:text-base">
                {item.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
