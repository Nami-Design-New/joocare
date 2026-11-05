export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 15;
export const PASSWORD_RULE_KEYS = [
  'length',
  'case',
  'number',
  'special',
] as const;

export function getPasswordRules(value: string) {
  return {
    length: value.length >= PASSWORD_MIN_LENGTH,
    case: /[A-Z]/.test(value) && /[a-z]/.test(value),
    number: /[0-9]/.test(value),
    special: /[^\p{L}\p{N}\s]/u.test(value),
  };
}

export function meetsPasswordRequirements(value: string) {
  return Object.values(getPasswordRules(value)).every(Boolean);
}

export const PREVIOUS_PASSWORD_RULE_KEY = 'different';

export function isDifferentFromPreviousPassword(
  value: string,
  previousPassword: string,
) {
  return value.length > 0 && value !== previousPassword;
}
