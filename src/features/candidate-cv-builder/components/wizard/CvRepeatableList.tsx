'use client';

import { useState, type ReactNode } from 'react';
import { useFieldArray, type FieldArray } from 'react-hook-form';
import { useItemReorder } from '../../hooks/useItemReorder';
import type { CvBuilderValues } from '../../types/cv-builder.types';
import CvAddItemModal, { type CvListName } from './CvAddItemModal';
import CvRepeatableItem from './CvRepeatableItem';

type CvRepeatableListProps<N extends CvListName> = {
  name: N;
  /** Item title, e.g. "Education 2". */
  getTitle: (position: number) => string;
  /** Title of the add modal, e.g. "Add Education". */
  addTitle: string;
  createItem: () => FieldArray<CvBuilderValues, N>;
  renderFields: (index: number) => ReactNode;
  /** Add button at the end of the last card; it opens the add modal. */
  renderAdd: (openAdd: () => void) => ReactNode;
};

// Repeatable item cards (remove / drag to reorder); new items are added from a modal.
// The last item can't be removed, only cleared.
export default function CvRepeatableList<N extends CvListName>({
  name,
  getTitle,
  addTitle,
  createItem,
  renderFields,
  renderAdd,
}: CvRepeatableListProps<N>) {
  const { fields, append, remove, move, update } = useFieldArray<
    CvBuilderValues,
    N
  >({ name });
  const getDragProps = useItemReorder(move);
  const [adding, setAdding] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {fields.map((field, index) => (
        <CvRepeatableItem
          key={field.id}
          title={getTitle(index + 1)}
          drag={getDragProps(index)}
          onRemove={() =>
            fields.length > 1 ? remove(index) : update(index, createItem())
          }
        >
          {renderFields(index)}
          {index === fields.length - 1 && renderAdd(() => setAdding(true))}
        </CvRepeatableItem>
      ))}
      {adding && (
        <CvAddItemModal
          name={name}
          title={addTitle}
          renderFields={renderFields}
          onAdd={(item) => append(item)}
          onClose={() => setAdding(false)}
        />
      )}
    </div>
  );
}
