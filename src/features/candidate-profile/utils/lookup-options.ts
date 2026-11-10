import type { Option } from '@/shared/components/SelectInputField';
import type { LookupOptionSource } from '../types/profile.types';

export function toLookupOptions(items: LookupOptionSource[]): Option[] {
  return items
    .map((item) => ({
      label: String(item.title ?? item.name ?? ''),
      value: String(item.id),
    }))
    .filter((option) => option.label);
}
