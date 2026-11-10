// GPA on a 4.0 scale: 0–3 with optional decimals, or 4 / 4.0.
const GPA_PATTERN = /^(?:[0-3](?:\.\d+)?|4(?:\.0+)?)$/;

export function isValidGpa(value: string) {
  return GPA_PATTERN.test(value.trim());
}
