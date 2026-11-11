'use client';
import * as React from 'react';

import { Input } from './ui/input';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTranslations } from 'next-intl';

type InputFieldProps = {
  label?: string;
  id: string;
  error?: string | boolean;
  containerStyles?: string;
  disable?: boolean;
  hint?: string;
  icon?: React.ReactNode;
  hidePasswordErrorMessage?: boolean;
} & React.ComponentProps<'input'>;

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      id,
      type = 'text',
      className,
      error,
      containerStyles,
      disabled = false,
      hint,
      icon,
      hidePasswordErrorMessage = false,
      value,
      defaultValue,
      onChange,
      onInput,
      'aria-describedby': describedBy,
      ...props
    },
    ref,
  ) => {
    const t = useTranslations('common.password-validation');
    const [showPassword, setShowPassword] = React.useState(false);
    const [useSafariPasswordMask, setUseSafariPasswordMask] =
      React.useState(false);

    const isPassword = type === 'password';
    const showInlineError = Boolean(
      error && !(isPassword && hidePasswordErrorMessage),
    );
    const errorId = `${id}-error`;
    const inputDescription =
      [describedBy, showInlineError && errorId].filter(Boolean).join(' ') ||
      undefined;

    React.useEffect(() => {
      const userAgent = navigator.userAgent;
      const isIOSWebKit =
        /iPad|iPhone|iPod/.test(userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const isSafari =
        /Safari/.test(userAgent) &&
        !/Chrome|Chromium|CriOS|FxiOS|EdgiOS|OPiOS|Android/.test(userAgent);

      setUseSafariPasswordMask(isIOSWebKit || isSafari);
    }, []);

    const shouldUseSafariMask =
      isPassword && useSafariPasswordMask && !showPassword;
    const inputType =
      isPassword && (showPassword || shouldUseSafariMask) ? 'text' : type;

    return (
      <div className={cn('flex w-full flex-col', containerStyles)}>
        {label && (
          <label htmlFor={id} className="mx-1 mb-1 font-semibold">
            {label}{' '}
            {hint && (
              <span className="text-sm font-normal text-muted-foreground">
                {' '}
                {hint}{' '}
              </span>
            )}
          </label>
        )}

        <div className="relative">
          <Input
            id={id}
            ref={ref}
            type={inputType}
            aria-invalid={!!error}
            disabled={disabled}
            className={cn(
              isPassword && 'pe-10',
              shouldUseSafariMask && 'safari-password-mask',
              className,
            )}
            {...(isPassword
              ? {
                  autoCapitalize: 'none',
                  autoCorrect: 'off',
                  spellCheck: false,
                }
              : {})}
            {...props}
            value={value}
            defaultValue={defaultValue}
            aria-describedby={inputDescription}
            onChange={(event) => {
              onChange?.(event);
            }}
            onInput={(event) => {
              onInput?.(event);
            }}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={t(showPassword ? 'hide-password' : 'show-password')}
              aria-pressed={showPassword}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
          )}
          {icon && (
            <div className="absolute end-3 top-1/2 -translate-y-1/2">
              {icon}
            </div>
          )}
        </div>

        {showInlineError && (
          <span id={errorId} className="mt-1 text-xs text-destructive">
            {error}
          </span>
        )}
      </div>
    );
  },
);

InputField.displayName = 'InputField';
