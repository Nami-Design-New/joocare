'use client';

import { useState } from 'react';
import type { CvItemDragProps } from '../components/wizard/CvRepeatableItem';

// Drag-and-drop reordering of item cards (native HTML drag events).
export function useItemReorder(move: (from: number, to: number) => void) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  return (index: number): CvItemDragProps => ({
    isDragging: dragIndex === index,
    onDragStart: (event) => {
      event.dataTransfer.effectAllowed = 'move';
      setDragIndex(index);
    },
    onDragOver: (event) => {
      if (dragIndex === null) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    },
    onDrop: (event) => {
      event.preventDefault();
      if (dragIndex !== null && dragIndex !== index) move(dragIndex, index);
      setDragIndex(null);
    },
    onDragEnd: () => setDragIndex(null),
  });
}
