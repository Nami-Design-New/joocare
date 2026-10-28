'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from '@/i18n/navigation';

export function useAssessmentLeaveGuard(
  isDirty: boolean,
  fallbackHref: string,
) {
  const router = useRouter();
  const [leaveOpen, setLeaveOpen] = useState(false);
  const destination = useRef<string | null>(null);
  const allowLeave = useRef(false);

  const requestLeave = useCallback(
    (href = fallbackHref) => {
      if (!isDirty) {
        router.push(href);
        return;
      }
      destination.current = href;
      setLeaveOpen(true);
    },
    [fallbackHref, isDirty, router],
  );

  useEffect(() => {
    if (!isDirty) return;
    function beforeUnload(event: BeforeUnloadEvent) {
      if (allowLeave.current) return;
      event.preventDefault();
      event.returnValue = '';
    }
    function click(event: MouseEvent) {
      if (
        allowLeave.current ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const anchor =
        event.target instanceof Element ? event.target.closest('a') : null;
      if (
        !anchor ||
        anchor.target === '_blank' ||
        anchor.hasAttribute('download') ||
        !anchor.href
      )
        return;
      const url = new URL(anchor.href);
      if (
        !['http:', 'https:'].includes(url.protocol) ||
        (url.pathname === location.pathname && url.search === location.search)
      )
        return;
      event.preventDefault();
      event.stopPropagation();
      destination.current = anchor.href;
      setLeaveOpen(true);
    }
    window.addEventListener('beforeunload', beforeUnload);
    document.addEventListener('click', click, true);
    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
      document.removeEventListener('click', click, true);
    };
  }, [isDirty]);

  function confirmLeave() {
    allowLeave.current = true;
    const href = destination.current ?? fallbackHref;
    setLeaveOpen(false);
    if (href.startsWith('http')) window.location.assign(href);
    else router.push(href);
  }

  return { leaveOpen, setLeaveOpen, requestLeave, confirmLeave };
}
