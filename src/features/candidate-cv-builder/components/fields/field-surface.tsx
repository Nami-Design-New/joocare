'use client';

import { createContext, useContext, type ReactNode } from 'react';

// Fields sit on a gray step card (white inputs) or on a white item card (gray inputs).
type FieldSurface = 'muted' | 'card';

const FieldSurfaceContext = createContext<FieldSurface>('card');

// Dropdowns inside a modal must render in the modal, not in <body>.
const PortalContainerContext = createContext<HTMLElement | null>(null);

// Prefix for field ids, so a modal copy of a card's fields doesn't reuse its ids.
const FieldIdPrefixContext = createContext('');

export function FieldSurfaceProvider({
  surface,
  children,
}: {
  surface: FieldSurface;
  children: ReactNode;
}) {
  return (
    <FieldSurfaceContext.Provider value={surface}>
      {children}
    </FieldSurfaceContext.Provider>
  );
}

export const PortalContainerProvider = PortalContainerContext.Provider;
export const FieldIdPrefixProvider = FieldIdPrefixContext.Provider;

/** Background class for inputs on the current surface. */
export function useFieldBackground() {
  return useContext(FieldSurfaceContext) === 'muted' ? 'bg-card' : 'bg-muted';
}

export function usePortalContainer() {
  return useContext(PortalContainerContext);
}

/** DOM id for a form field name. */
export function useFieldId(name: string) {
  return `${useContext(FieldIdPrefixContext)}${name}`;
}
