import { useTranslations } from 'next-intl';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { ATS_INTRO_FEATURES } from '../../constants';

// "ATS Compliance / Skills Gap Analysis / Instant Improvement Tips"; the first one starts open.
export default function AtsFeatureAccordion() {
  const t = useTranslations('candidatePage.cvMatchAts.features');

  return (
    <Accordion type="single" collapsible defaultValue={ATS_INTRO_FEATURES[0]}>
      {ATS_INTRO_FEATURES.map((feature) => (
        <AccordionItem key={feature} value={feature} className="border-border">
          <AccordionTrigger
            iconType="arrow"
            className="text-ats-primary items-center p-4 text-start text-[21px] leading-6.5 font-semibold hover:no-underline [&>svg]:translate-y-0"
          >
            {t(`${feature}.title`)}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground px-4 text-justify text-lg leading-6">
            {t(`${feature}.description`)}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
