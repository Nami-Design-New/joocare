import HowItWorksCard from './HowItWorksCard';
import SectionTitle from './SectionTitle';
import type { HomeStep } from '../types/home.types';
import { useTranslations } from 'next-intl';

export default function HowItWorks({
  title,
  steps,
}: {
  title: string;
  steps: HomeStep[];
}) {
  const t = useTranslations();
  return (
    <section className="bg-white">
      <section className="layout-shell py-10 pt-10 pb-10 text-center md:pt-30 md:pb-20">
        <section className="layout-content flex flex-col items-center justify-center gap-8">
          <section className="mx-auto flex max-w-108 flex-col items-center justify-center gap-4 leading-tight">
            <SectionTitle sectionTitle={t('home.how-it-work')} />
            <h2>{title}</h2>
          </section>
          <section className="mx-auto flex min-w-full flex-col gap-4 gap-y-6 md:flex-row">
            {steps.map((step) => (
              <HowItWorksCard
                key={step.id}
                icon={step.image}
                title={step.title}
                description={step.description}
              />
            ))}
          </section>
        </section>
      </section>
    </section>
  );
}
