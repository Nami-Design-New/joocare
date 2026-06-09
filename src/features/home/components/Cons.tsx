import Image from "next/image";
import type { HomeWhyModel } from "../types/home.types";
import SectionTitle from "./SectionTitle";
import { useTranslations } from "next-intl";

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
      <h3 className="text-secondary mt-2 text-base md:text-xl font-semibold">{title}</h3>
      <p className="text-4 text-muted-foreground mt-6 mb-10   text-sm md:text-base">{description}</p>
      <ul className="flex flex-col items-start gap-8">
        {items.map((item) => (
          <li key={item.id} className="flex gap-7">
            <div className="bg-primary flex h-10 md:h-12 w-10 md:w-12 shrink-0 items-center justify-center rounded-full">
              <Image src={item.icon as string} alt="icon" width={18} height={18} />
            </div>
            <div>
              <h4 className="my-2 text-base md:text-xl font-semibold">{item.title}</h4>
              <p className="text-muted-foreground font-normal text-sm md:text-base">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
