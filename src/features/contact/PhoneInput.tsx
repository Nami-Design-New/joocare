'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

type PhoneOption = {
  value: string;
  label: string;
  flag?: string;
  emoji?: string;
};

const PHONE_OPTIONS: PhoneOption[] = [
  {
    value: '+966',
    label: 'Saudi Arabia',
    flag: '/assets/contact/sa.svg',
    emoji: '🇸🇦',
  },
  { value: '+20', label: 'Egypt', emoji: '🇪🇬' },
  { value: '+1', label: 'United States', emoji: '🇺🇸' },
];

export function PhoneInput() {
  const [code, setCode] = useState<string>(PHONE_OPTIONS[0].value);

  const selected = useMemo(
    () =>
      PHONE_OPTIONS.find((option) => option.value === code) ?? PHONE_OPTIONS[0],
    [code],
  );

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-foreground">
        phone Number
      </label>
      <div className="flex items-center gap-2">
        <Select value={code} onValueChange={setCode}>
          <SelectTrigger className="w-35 rounded-full border-border bg-muted text-sm text-foreground">
            <div className="flex items-center gap-2">
              {/* {selected.flag ? (
                <Image
                  src={selected.flag}
                  alt={selected.label}
                  width={20}
                  height={14}
                  className="rounded-sm object-cover"
                />
              ) : (
                <span className="text-sm">{selected.emoji}</span>
              )} */}
              <SelectValue placeholder={selected.value} />
            </div>
          </SelectTrigger>

          <SelectContent className="rounded-xl border-border bg-card">
            {PHONE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <span className="flex items-center gap-2">
                  {option.flag ? (
                    <Image
                      src={option.flag}
                      alt={option.label}
                      width={20}
                      height={14}
                      className="rounded-sm object-cover"
                    />
                  ) : (
                    <span>{option.emoji}</span>
                  )}
                  <span>{option.value}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <input
          placeholder="ex:52 987 6543"
          className="flex-1 rounded-full border border-border bg-muted px-4 py-3 text-sm text-foreground transition-all duration-200 outline-none placeholder:text-muted-foreground hover:border-primary/40 focus:border-primary focus:bg-card focus-visible:ring-2 focus-visible:ring-ring/25"
        />
      </div>
    </div>
  );
}
