'use client';

import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  getPasswordRules,
  isDifferentFromPreviousPassword,
  PASSWORD_RULE_KEYS,
  PREVIOUS_PASSWORD_RULE_KEY,
} from '../lib/password-rules';
import { cn } from '../lib/utils';

type PasswordRuleKey =
  | (typeof PASSWORD_RULE_KEYS)[number]
  | typeof PREVIOUS_PASSWORD_RULE_KEY;

type PasswordRequirementsProps = {
  id: string;
  value: string;
  hasError?: boolean;
  className?: string;
  /** Adds the "different from your previous password" rule (reset / change password only). */
  showPreviousPasswordRule?: boolean;
  /** When known (change password), the previous-password rule is evaluated; otherwise it stays neutral. */
  previousPassword?: string;
};

type PasswordRuleItemProps = {
  ruleKey: PasswordRuleKey;
  label: string;
  isValid: boolean;
  isFailed: boolean;
  statusLabel?: string;
};

function PasswordRuleItem({
  ruleKey,
  label,
  isValid,
  isFailed,
  statusLabel,
}: PasswordRuleItemProps) {
  return (
    <li
      data-password-rule={ruleKey}
      data-valid={isValid}
      className={cn(
        'text-muted-foreground flex items-center gap-2',
        isValid && 'text-success',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'border-foreground/30 flex size-4.5 shrink-0 items-center justify-center rounded-full border-[1.5px]',
          isFailed && 'border-destructive',
          isValid && 'border-success bg-success text-success-foreground',
        )}
      >
        {isValid && <Check className="size-3" strokeWidth={2.5} />}
      </span>
      <span>
        {label}
        {statusLabel && <span className="sr-only"> — {statusLabel}</span>}
      </span>
    </li>
  );
}

export default function PasswordRequirements({
  id,
  value,
  hasError = false,
  className,
  showPreviousPasswordRule = false,
  previousPassword,
}: PasswordRequirementsProps) {
  const t = useTranslations('common.password-validation');
  const rules = getPasswordRules(value);
  const canEvaluatePreviousPassword = previousPassword !== undefined;
  const isDifferentFromPrevious =
    canEvaluatePreviousPassword &&
    isDifferentFromPreviousPassword(value, previousPassword);

  return (
    <div
      id={id}
      className={cn(
        ' flex w-full flex-col gap-2 text-start text-sm',
        className,
      )}
    >
      <p className="text-secondary font-medium">{t('title')}</p>
      <ul aria-live="polite" className="flex flex-col gap-2">
        {PASSWORD_RULE_KEYS.map((key) => (
          <PasswordRuleItem
            key={key}
            ruleKey={key}
            label={t(key)}
            isValid={rules[key]}
            isFailed={hasError && !rules[key]}
            statusLabel={t(rules[key] ? 'met' : 'unmet')}
          />
        ))}
        {showPreviousPasswordRule && (
          <PasswordRuleItem
            ruleKey={PREVIOUS_PASSWORD_RULE_KEY}
            label={t(PREVIOUS_PASSWORD_RULE_KEY)}
            isValid={isDifferentFromPrevious}
            isFailed={
              canEvaluatePreviousPassword &&
              hasError &&
              !isDifferentFromPrevious
            }
            statusLabel={
              canEvaluatePreviousPassword
                ? t(isDifferentFromPrevious ? 'met' : 'unmet')
                : undefined
            }
          />
        )}
      </ul>
    </div>
  );
}
