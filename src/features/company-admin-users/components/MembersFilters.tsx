'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { InputField } from '@/shared/components/InputField';
import { SelectInputField } from '@/shared/components/SelectInputField';

type MembersFiltersProps = {
  search: string;
  roleFilter: string;
  roles: string[];
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
};

export default function MembersFilters({
  search,
  roleFilter,
  roles,
  onSearchChange,
  onRoleChange,
}: MembersFiltersProps) {
  const t = useTranslations('companyPage.usersManagement');
  const roleOptions = roles.map((role) => ({ label: role, value: role }));

  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_214px]">
      <div className="relative">
        <Search className="text-primary absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <InputField
          id="company-members-search"
          aria-label={t('searchPlaceholder')}
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="h-10 border-0 bg-white pl-10 shadow-none focus-visible:ring-1"
        />
      </div>
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
