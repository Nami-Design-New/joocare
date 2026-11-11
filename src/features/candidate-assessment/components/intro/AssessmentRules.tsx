import { CircleCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  ASSESSMENT_LINK_VALIDITY_HOURS,
  ASSESSMENT_RULE_KEYS,
} from '../../constants';

type AssessmentRulesProps = {
  questionCount: number;
  passScore: number;
};

// "Important Assessment Rules" panel on the intro card.
export default function AssessmentRules({
  questionCount,
  passScore,
}: AssessmentRulesProps) {
  const t = useTranslations('candidatePage.assessment.intro');
  const values = {
    hours: ASSESSMENT_LINK_VALIDITY_HOURS,
    count: questionCount,
    score: passScore,
  };

  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-assessment-primary/4 p-4">
      <h2 className="text-lg font-semibold text-foreground">
        {t('rules-title')}
      </h2>
      <ul className="flex flex-col gap-3">
        {ASSESSMENT_RULE_KEYS.map((key) => (
          <li
            key={key}
            className="flex items-start gap-3 text-base leading-5 text-foreground"
          >
            <CircleCheck
              aria-hidden
              className="mt-0.5 size-4 shrink-0 text-assessment-primary"
              strokeWidth={2}
            />
            <p>
              {t.rich(`rules.${key}`, {
                ...values,
                strong: (chunks) => (
                  <strong className="font-semibold">{chunks}</strong>
                ),
                highlight: (chunks) => (
                  <span className="font-semibold text-assessment-primary">
                    {chunks}
                  </span>
                ),
              })}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
