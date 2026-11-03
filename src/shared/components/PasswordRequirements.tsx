'use client';

import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getPasswordRules, PASSWORD_RULE_KEYS } from '../lib/password-rules';
import { cn } from '../lib/utils';

type PasswordRequirementsProps = {
  id: string;
  value: string;
  hasError?: boolean;
  className?: string;
};

export default function PasswordRequirements({
  id,
  value,
  hasError = false,
  className,
}: PasswordRequirementsProps) {
  const t = useTranslations('common.password-validation');
  const rules = getPasswordRules(value);

  return (
    <div
      id={id}
      className={cn(
        'mt-4 flex w-full flex-col gap-2 text-start text-sm',
        className,
      )}
    >
      <p className="text-secondary font-medium">{t('title')}</p>
      <ul aria-live="polite" className="flex flex-col gap-2">
        {PASSWORD_RULE_KEYS.map((key) => (
          <li
            key={key}
            data-password-rule={key}
            data-valid={rules[key]}
            className={cn(
              'text-muted-foreground flex items-center gap-2',
              rules[key] && 'text-success',
            )}
          >
            <span
              aria-hidden
              className={cn(
                'border-foreground/30 flex size-4.5 shrink-0 items-center justify-center rounded-full border-[1.5px]',
                hasError && !rules[key] && 'border-destructive',
                rules[key] &&
                  'border-success bg-success text-success-foreground',
              )}
            >
              {rules[key] && <Check className="size-3" strokeWidth={2.5} />}
            </span>
            <span>
              {t(key)}
              <span className="sr-only">
                {' '}
                — {t(rules[key] ? 'met' : 'unmet')}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
