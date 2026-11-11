'use client';

import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useFieldArray, useWatch, type FieldArray } from 'react-hook-form';
import { cn } from '@/shared/lib/utils';
import type { CvBuilderValues } from '../../types/cv-builder.types';
import CvSwitchCard from '../fields/CvSwitchCard';
import { FieldSurfaceProvider } from '../fields/field-surface';
import CvAddButton from './CvAddButton';

type SwitchSection = 'research' | 'conferences';

type CvSwitchEntriesProps = {
  section: SwitchSection;
  title: string;
  description: string;
  addLabel: string;
  removeLabel: string;
  createItem: () => FieldArray<CvBuilderValues, `${SwitchSection}.items`>;
  renderFields: (index: number) => ReactNode;
};

// "Do you have …?" switch; when on, shows repeatable entries (research, CPD & conferences).
export default function CvSwitchEntries({
  section,
  title,
  description,
  addLabel,
  removeLabel,
  createItem,
  renderFields,
}: CvSwitchEntriesProps) {
  const enabled = useWatch<CvBuilderValues, `${SwitchSection}.enabled`>({
    name: `${section}.enabled`,
  });
  const { fields, append, remove } = useFieldArray<
    CvBuilderValues,
    `${SwitchSection}.items`
  >({ name: `${section}.items` });

  return (
    <CvSwitchCard
      name={`${section}.enabled`}
      title={title}
      description={description}
      variant="section"
    >
      {enabled && (
        <FieldSurfaceProvider surface="muted">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className={cn(
                'flex flex-col gap-3',
                index > 0 && 'border-t border-border pt-3',
              )}
            >
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label={removeLabel}
                  className="self-end rounded-full p-1 text-muted-foreground hover:text-destructive"
                >
                  <X aria-hidden className="size-5" />
                </button>
              )}
              {renderFields(index)}
            </div>
          ))}
          <CvAddButton
            variant="link"
            label={addLabel}
            onClick={() => append(createItem())}
          />
        </FieldSurfaceProvider>
      )}
    </CvSwitchCard>
  );
}
