'use client';

import { ChevronUp, GripVertical } from 'lucide-react';
import Image from 'next/image';
import { useState, type DragEvent, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import { CV_BUILDER_ICONS } from '../../constants';
import { FieldSurfaceProvider } from '../fields/field-surface';

export type CvItemDragProps = {
  onDragStart: (event: DragEvent<HTMLElement>) => void;
  onDragOver: (event: DragEvent<HTMLElement>) => void;
  onDrop: (event: DragEvent<HTMLElement>) => void;
  onDragEnd: () => void;
  isDragging: boolean;
};

type CvRepeatableItemProps = {
  title: string;
  onRemove: () => void;
  drag: CvItemDragProps;
  children: ReactNode;
};

// White, collapsible item card (Education 1, Certificate 1, Experience 1) with a drag handle.
export default function CvRepeatableItem({
  title,
  onRemove,
  drag,
  children,
}: CvRepeatableItemProps) {
  const t = useTranslations('candidatePage.buildCv.item');
  const [open, setOpen] = useState(true);

  return (
    <article
      onDragOver={drag.onDragOver}
      onDrop={drag.onDrop}
      className={cn(
        'bg-card flex flex-col gap-4 rounded-lg p-4 transition-opacity',
        drag.isDragging && 'opacity-50',
      )}
    >
      <header className="flex min-h-8 items-center gap-4">
        <span
          draggable
          onDragStart={(event) => {
            const card = event.currentTarget.closest('article');
            if (card) event.dataTransfer.setDragImage(card, 24, 24);
            drag.onDragStart(event);
          }}
          onDragEnd={drag.onDragEnd}
          aria-hidden
          className="text-muted-foreground cursor-grab active:cursor-grabbing"
        >
          <GripVertical aria-hidden className="size-5" />
        </span>
        <h3 className="text-foreground grow text-lg leading-6">{title}</h3>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={t(open ? 'collapse' : 'expand', { title })}
          className="text-foreground flex size-8 items-center justify-center rounded-full"
        >
          <ChevronUp
            aria-hidden
            className={cn('size-5 transition-transform', !open && 'rotate-180')}
          />
        </button>
        <button
          type="button"
          onClick={onRemove}
          aria-label={t('remove', { title })}
          className="flex size-8 items-center justify-center rounded-full"
        >
          <Image src={CV_BUILDER_ICONS.trash} alt="" width={20} height={20} />
        </button>
      </header>
      <div className={cn('flex flex-col gap-3', !open && 'hidden')}>
        <FieldSurfaceProvider surface="card">{children}</FieldSurfaceProvider>
      </div>
    </article>
  );
}
