'use client';

import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { InputField } from '@/shared/components/InputField';
import { PhoneInputCode } from '@/shared/components/PhoneInputCode';
import {
  SelectInputField,
  type Option,
} from '@/shared/components/SelectInputField';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { DEFAULT_PHONE_COUNTRY } from '@/shared/lib/phone';
import type { CompanyMember } from '../types/member.types';
import {
  createMemberSchema,
  type TMemberSchema,
} from '../validation/member-schema';

type MemberFormModalProps = {
  open: boolean;
  member: CompanyMember | null;
  roleOptions: Option[];
  isSaving: boolean;
  onClose: () => void;
  onSave: (values: TMemberSchema) => void;
};

function createDefaultValues(member: CompanyMember | null): TMemberSchema {
  return {
    name: member?.name ?? '',
    email: member?.email ?? '',
    phoneNumber: member?.phoneNumber ?? '',
    role: member?.roleValue ?? '',
    displayedRoleName: member?.displayedRoleName ?? '',
  };
}

export default function MemberFormModal({
  open,
  member,
  roleOptions,
  isSaving,
  onClose,
  onSave,
}: MemberFormModalProps) {
  const t = useTranslations('companyPage.usersManagement');
  // The role list renders inside the dialog; outside it the dialog blocks clicks.
  const [contentElement, setContentElement] = useState<HTMLDivElement | null>(
    null,
  );
  const schema = useMemo(
    () =>
      createMemberSchema({
        nameRequired: t('validation.name-required'),
        nameMax: t('validation.name-max'),
        emailRequired: t('validation.email-required'),
        emailInvalid: t('validation.email-invalid'),
        phoneRequired: t('validation.phone-required'),
        phoneInvalid: t('validation.phone-invalid'),
        roleRequired: t('validation.role-required'),
        displayedRoleNameMax: t('validation.displayed-role-name-max'),
      }),
    [t],
  );
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TMemberSchema>({
    resolver: zodResolver(schema),
    defaultValues: createDefaultValues(member),
  });

  const onSubmit: SubmitHandler<TMemberSchema> = (values) => onSave(values);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => !isOpen && !isSaving && onClose()}
    >
      <DialogContent
        ref={setContentElement}
        showCloseButton
        className="max-w-lg rounded-2xl p-5 sm:p-10 [&_button]:text-xs [&_input]:text-sm [&_label]:text-sm"
      >
        <DialogHeader>
          <DialogTitle className="text-[22px]">
            {member ? t('editMember') : t('addNewMember')}
          </DialogTitle>
        </DialogHeader>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <InputField
            id="member-name"
            label={t('fields.name')}
            error={errors.name?.message}
            className="h-[52px] rounded-full text-sm"
            autoComplete="name"
            {...register('name')}
          />
          <InputField
            id="member-email"
            label={t('fields.email')}
            type="email"
            readOnly={Boolean(member)}
            error={errors.email?.message}
            className="h-[52px] rounded-full bg-muted text-sm"
            autoComplete="email"
            {...register('email')}
          />
          <div className="flex flex-col gap-1">
            <label htmlFor="member-phone" className="mx-1 mb-1 font-semibold">
              {t('fields.phone')}
            </label>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <PhoneInputCode
                  {...field}
                  id="member-phone"
                  defaultCountry={DEFAULT_PHONE_COUNTRY}
                  onChange={(value) => field.onChange(value ?? '')}
                  error={Boolean(errors.phoneNumber)}
                  aria-invalid={Boolean(errors.phoneNumber)}
                  aria-describedby={
                    errors.phoneNumber ? 'member-phone-error' : undefined
                  }
                  className="gap-2 [&_button]:text-sm"
                />
              )}
            />
            {errors.phoneNumber ? (
              <span
                id="member-phone-error"
                className="mt-1 text-xs text-destructive"
              >
                {errors.phoneNumber.message}
              </span>
            ) : null}
          </div>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <SelectInputField
                id="member-role"
                label={t('fields.role')}
                options={roleOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder={t('selectRole')}
                error={errors.role?.message}
                portalContainer={contentElement}
                className="text-xs"
              />
            )}
          />
          <InputField
            id="member-displayed-role"
            label={t('fields.displayedRoleName')}
            error={errors.displayedRoleName?.message}
            className="h-[52px] rounded-full text-sm"
            {...register('displayedRoleName')}
          />
          <Button
            type="submit"
            disabled={isSaving}
            className="mx-auto mt-6 flex h-12 w-full max-w-56 rounded-full text-xs"
          >
            {isSaving ? t('saving') : t('save')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
