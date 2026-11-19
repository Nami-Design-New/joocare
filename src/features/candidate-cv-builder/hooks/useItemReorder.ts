'use client';

import { useEffect, useRef, useState } from 'react';
import type { CvItemDragProps } from '../components/wizard/CvRepeatableItem';

function indexAtPoint(x: number, y: number) {
  const cards = Array.from(
    document.querySelectorAll<HTMLElement>('[data-cv-reorder-index]'),
  );
  const card =
    document.elementFromPoint(x, y)?.closest('[data-cv-reorder-index]') ??
    cards
      .filter((item) => {
        const rect = item.getBoundingClientRect();
        return x >= rect.left && x <= rect.right;
      })
      .sort((first, second) => {
        const distance = (item: HTMLElement) => {
          const rect = item.getBoundingClientRect();
          return Math.max(rect.top - y, 0, y - rect.bottom);
        };
        return distance(first) - distance(second);
      })[0];
  const index = Number(card?.getAttribute('data-cv-reorder-index'));
  return card && Number.isInteger(index) ? index : null;
}

function edgeScrollSpeed(y: number) {
  const threshold = 80;
  if (y < threshold) return -Math.ceil((threshold - y) / 4);
  if (y > window.innerHeight - threshold)
    return Math.ceil((y - (window.innerHeight - threshold)) / 4);
  return 0;
}

// Pointer and keyboard reordering of repeatable CV cards.
export function useItemReorder(
  move: (from: number, to: number) => void,
  itemCount: number,
) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const activeIndex = useRef<number | null>(null);
  const pointerPosition = useRef<{ x: number; y: number } | null>(null);
  const scrollFrame = useRef<number | null>(null);

  const autoScroll = () => {
    const pointer = pointerPosition.current;
    const speed = pointer ? edgeScrollSpeed(pointer.y) : 0;
    if (activeIndex.current === null || !pointer || speed === 0) {
      scrollFrame.current = null;
      return;
    }

    const before = window.scrollY;
    window.scrollBy(0, speed);
    setDropIndex(indexAtPoint(pointer.x, pointer.y));
    scrollFrame.current =
      window.scrollY === before ? null : requestAnimationFrame(autoScroll);
  };

  const reset = () => {
    activeIndex.current = null;
    pointerPosition.current = null;
    if (scrollFrame.current !== null) cancelAnimationFrame(scrollFrame.current);
    scrollFrame.current = null;
    setDragIndex(null);
    setDropIndex(null);
  };

  useEffect(() => {
    return () => {
      if (scrollFrame.current !== null)
        cancelAnimationFrame(scrollFrame.current);
    };
  }, []);

  return (index: number): CvItemDragProps => ({
    index,
    disabled: itemCount < 2,
    isDragging: dragIndex === index,
    isDropTarget: dropIndex === index && dragIndex !== index,
    onPointerDown: (event) => {
      if (
        itemCount < 2 ||
        (event.pointerType === 'mouse' && event.button !== 0)
      )
        return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      activeIndex.current = index;
      pointerPosition.current = { x: event.clientX, y: event.clientY };
      setDragIndex(index);
    },
    onPointerMove: (event) => {
      if (activeIndex.current === null) return;
      pointerPosition.current = { x: event.clientX, y: event.clientY };
      setDropIndex(indexAtPoint(event.clientX, event.clientY));
      if (scrollFrame.current === null && edgeScrollSpeed(event.clientY) !== 0)
        scrollFrame.current = requestAnimationFrame(autoScroll);
    },
    onPointerUp: (event) => {
      const from = activeIndex.current;
      const to = indexAtPoint(event.clientX, event.clientY);
      reset();
      if (from !== null && to !== null && from !== to) move(from, to);
    },
    onPointerCancel: reset,
    onKeyDown: (event) => {
      const to =
        event.key === 'ArrowUp'
          ? index - 1
          : event.key === 'ArrowDown'
            ? index + 1
            : null;
      if (to === null || to < 0 || to >= itemCount) return;
      event.preventDefault();
      move(index, to);
    },
  });
}
