'use client';

import { useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { FormProvider, useForm, type FieldArray } from 'react-hook-form';
import ModalHeading from '@/shared/components/modals/ModalHeading';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent } from '@/shared/components/ui/dialog';
import { typedZodResolver } from '@/shared/lib/typed-zod-resolver';
import { useCvBuilderSchema } from '../../hooks/useCvBuilderSchema';
import type { CvBuilderValues } from '../../types/cv-builder.types';
import { getEmptyCvValues } from '../../utils/cv-builder-defaults';
import {
  FieldIdPrefixProvider,
  FieldSurfaceProvider,
  PortalContainerProvider,
} from '../fields/field-surface';

export type CvListName = 'educations' | 'certificates' | 'experience.items';

type CvAddItemModalProps<N extends CvListName> = {
  name: N;
  title: string;
  /** Same fields as the item card, rendered for index 0 of a separate form. */
  renderFields: (index: number) => ReactNode;
  onAdd: (item: FieldArray<CvBuilderValues, N>) => void;
  onClose: () => void;
};

// "Add Education / Certificates / Experience" modal; mounted while open so each opening starts empty.
export default function CvAddItemModal<N extends CvListName>({
  name,
  title,
  renderFields,
  onAdd,
  onClose,
}: CvAddItemModalProps<N>) {
  const t = useTranslations('candidatePage.buildCv.wizard');
  const schema = useCvBuilderSchema();
  // A fresh CV form holds one empty item in each list; only `${name}.0` is validated.
  const form = useForm<CvBuilderValues>({
    resolver: typedZodResolver(schema),
    defaultValues: getEmptyCvValues(),
    mode: 'onTouched',
  });
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );
  const itemPath = `${name}.0` as const;

  const submit = async () => {
    const isValid = await form.trigger([itemPath], { shouldFocus: true });
    if (!isValid) return;
    onAdd(form.getValues(itemPath) as FieldArray<CvBuilderValues, N>);
    onClose();
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent ref={setPortalContainer} className="max-w-175">
        <FormProvider {...form}>
          <form
            noValidate
            onSubmit={(event) => {
              // Keep the submit inside the modal (React events bubble to the wizard form).
              event.preventDefault();
              event.stopPropagation();
              void submit();
            }}
            className="flex flex-col gap-5"
          >
            <ModalHeading
              title={title}
              titleClassName="text-foreground font-bold"
            />
            <FieldIdPrefixProvider value="add-item-">
              <PortalContainerProvider value={portalContainer}>
                <FieldSurfaceProvider surface="card">
                  <div className="flex flex-col gap-3">{renderFields(0)}</div>
                </FieldSurfaceProvider>
              </PortalContainerProvider>
            </FieldIdPrefixProvider>
            <Button
              type="submit"
              size="pill"
              className="h-12.5 w-full self-center bg-cv-builder-primary font-semibold hover:bg-cv-builder-primary/90 sm:w-56"
            >
              {t('add')}
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
