'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useRouter } from '@/i18n/navigation';

export function useAssessmentLeaveGuard(
  isDirty: boolean,
  fallbackHref: string,
  guardBrowserBack = false,
) {
  const router = useRouter();
  const [leaveOpen, setLeaveOpen] = useState(false);
  const destination = useRef<string | null>(null);
  const allowLeave = useRef(false);
  const backRequested = useRef(false);
  const historyGuardId = useId();
  const historyGuardLifecycle = useRef({ generation: 0 });

  const requestLeave = useCallback(
    (href = fallbackHref) => {
      if (!isDirty) {
        router.push(href);
        return;
      }
      destination.current = href;
      backRequested.current = false;
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
      backRequested.current = false;
      setLeaveOpen(true);
    }
    window.addEventListener('beforeunload', beforeUnload);
    document.addEventListener('click', click, true);
    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
      document.removeEventListener('click', click, true);
    };
  }, [isDirty]);

  useEffect(() => {
    if (!isDirty || !guardBrowserBack) return;

    const lifecycle = historyGuardLifecycle.current;
    const generation = ++lifecycle.generation;
    const marker = '__assessmentLeaveGuard';
    const href = window.location.href;

    // Keep Back in this document so it can show our React dialog before leaving.
    // Preserve Next.js' history state so its router can still restore this entry.
    if (window.history.state?.[marker] !== historyGuardId) {
      window.history.pushState(
        { ...window.history.state, [marker]: historyGuardId },
        '',
        href,
      );
    }

    function popstate(event: PopStateEvent) {
      if (allowLeave.current || event.state?.[marker] === historyGuardId) return;
      event.stopImmediatePropagation();
      window.history.forward();
      backRequested.current = true;
      destination.current = null;
      setLeaveOpen(true);
    }

    window.addEventListener('popstate', popstate, true);
    return () => {
      window.removeEventListener('popstate', popstate, true);
      // Strict Mode immediately reinstalls this effect; keep its existing entry.
      // When an attempt ends, remove the extra entry without leaving this page.
      queueMicrotask(() => {
        if (
          lifecycle.generation === generation &&
          !allowLeave.current &&
          window.location.href === href &&
          window.history.state?.[marker] === historyGuardId
        ) {
          window.history.back();
        }
      });
    };
  }, [guardBrowserBack, historyGuardId, isDirty]);

  function confirmLeave() {
    allowLeave.current = true;
    const href = destination.current ?? fallbackHref;
    setLeaveOpen(false);
    if (backRequested.current) {
      // Skip both our guard entry and the original assessment entry.
      window.history.go(
        window.history.state?.__assessmentLeaveGuard === historyGuardId ? -2 : -1,
      );
      return;
    }
    const hasGuardEntry =
      window.history.state?.__assessmentLeaveGuard === historyGuardId;
    if (href.startsWith('http')) {
      if (hasGuardEntry) window.location.replace(href);
      else window.location.assign(href);
    } else if (hasGuardEntry) router.replace(href);
    else router.push(href);
  }

  return { leaveOpen, setLeaveOpen, requestLeave, confirmLeave };
}
