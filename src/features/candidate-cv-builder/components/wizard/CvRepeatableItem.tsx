'use client';

import { ChevronUp, GripVertical } from 'lucide-react';
import Image from 'next/image';
import {
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import { CV_BUILDER_ICONS } from '../../constants';
import { FieldSurfaceProvider } from '../fields/field-surface';

export type CvItemDragProps = {
  index: number;
  disabled: boolean;
  onPointerDown: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerCancel: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  isDragging: boolean;
  isDropTarget: boolean;
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
      data-cv-reorder-index={drag.index}
      className={cn(
        'flex flex-col gap-4 rounded-lg bg-card p-4 transition-opacity',
        drag.isDragging && 'opacity-50',
        drag.isDropTarget && 'ring-2 ring-cv-builder-primary',
      )}
    >
      <header className="flex min-h-8 items-center gap-4">
        <button
          type="button"
          disabled={drag.disabled}
          onPointerDown={drag.onPointerDown}
          onPointerMove={drag.onPointerMove}
          onPointerUp={drag.onPointerUp}
          onPointerCancel={drag.onPointerCancel}
          onKeyDown={drag.onKeyDown}
          aria-label={t('reorder', { title })}
          aria-keyshortcuts="ArrowUp ArrowDown"
          className="flex size-8 touch-none items-center justify-center text-muted-foreground enabled:cursor-grab enabled:active:cursor-grabbing"
        >
          <GripVertical aria-hidden className="size-5" />
        </button>
        <h3 className="grow text-lg leading-6 text-foreground">{title}</h3>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={t(open ? 'collapse' : 'expand', { title })}
          className="flex size-8 items-center justify-center rounded-full text-foreground"
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
