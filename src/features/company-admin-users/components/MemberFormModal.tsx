'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { InputField } from '@/shared/components/InputField';
import { PhoneInputCode } from '@/shared/components/PhoneInputCode';
import { SelectInputField } from '@/shared/components/SelectInputField';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import type { CompanyMember, CompanyMemberFormValues } from '../types/member.types';

type MemberFormModalProps = {
  open: boolean;
  member: CompanyMember | null;
  roles: string[];
  onClose: () => void;
  onSave: (values: CompanyMemberFormValues) => void;
};

function createInitialForm(member: CompanyMember | null): CompanyMemberFormValues {
  return {
    name: member?.name ?? '',
    email: member?.email ?? '',
    phone: member?.phone ?? '',
    role: member?.role ?? '',
    displayedRoleName: member?.displayedRoleName ?? '',
  };
}

export default function MemberFormModal({
  open,
  member,
  roles,
  onClose,
  onSave,
}: MemberFormModalProps) {
  const t = useTranslations('companyPage.usersManagement');
  const [form, setForm] = useState(() => createInitialForm(member));
  const roleOptions = roles.map((role) => ({ label: role, value: role }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave(form);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        showCloseButton
        className="max-w-lg rounded-2xl p-8 sm:p-10 [&_label]:text-sm [&_input]:text-sm [&_button]:text-xs"
      >
        <DialogHeader>
          <DialogTitle className="text-[22px]">
            {member ? t('editMember') : t('addNewMember')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="member-name"
            label={t('fields.name')}
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="h-[52px] rounded-full text-sm"
            required
          />
          <InputField
            id="member-email"
            label={t('fields.email')}
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            disabled={Boolean(member)}
            className="h-[52px] rounded-full bg-muted text-sm disabled:opacity-100"
            required
          />
          <div className="flex flex-col gap-1">
            <label htmlFor="member-phone" className="mx-1 mb-1 font-semibold">
              {t('fields.phone')}
            </label>
            <PhoneInputCode
              id="member-phone"
              defaultCountry="SA"
              value={form.phone}
              onChange={(phone) => setForm({ ...form, phone })}
              className="gap-2 [&_button]:text-sm"
            />
          </div>
          <SelectInputField
            id="member-role"
            label={t('fields.role')}
            options={roleOptions}
            value={form.role}
            onChange={(role) => setForm({ ...form, role })}
            placeholder={t('selectRole')}
            className="text-xs"
          />
          <InputField
            id="member-displayed-role"
            label={t('fields.displayedRoleName')}
            value={form.displayedRoleName}
            onChange={(event) =>
              setForm({ ...form, displayedRoleName: event.target.value })
            }
            className="h-[52px] rounded-full text-sm"
          />
          <Button
            type="submit"
            disabled={!form.role}
            className="mx-auto mt-6 flex h-12 w-full max-w-56 rounded-full text-xs"
          >
            {t('save')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
