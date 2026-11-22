'use client';

import { useTranslations } from 'next-intl';
import SearchInput from '@/shared/components/SearchInput';
import {
  SelectInputField,
  type Option,
} from '@/shared/components/SelectInputField';

type MembersFiltersProps = {
  search: string;
  roleFilter: string;
  roleOptions: Option[];
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
};

export default function MembersFilters({
  search,
  roleFilter,
  roleOptions,
  onSearchChange,
  onRoleChange,
}: MembersFiltersProps) {
  const t = useTranslations('companyPage.usersManagement');

  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_214px]">
      <SearchInput
        id="company-members-search"
        placeholder={t('searchPlaceholder')}
        aria-label={t('searchPlaceholder')}
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        iconClassName="start-3 size-4"
        className="h-10 bg-white ps-10 focus-visible:ring-1"
      />
      <SelectInputField
        id="company-members-role-filter"
        aria-label={t('roleFilter')}
        options={roleOptions}
        value={roleFilter}
        onChange={onRoleChange}
        placeholder={t('roleFilter')}
        className="h-10 border-0 bg-white shadow-none"
        allowDeselect
      />
    </div>
  );
}
