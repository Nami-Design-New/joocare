'use client';

import type { ReactNode } from 'react';
import { useInviteToken } from '../hooks/useInviteToken';

type InviteTokenGuardProps = {
  children: ReactNode;
};

export default function InviteTokenGuard({ children }: InviteTokenGuardProps) {
  const { status } = useInviteToken();

  if (status !== 'valid') return null;

  return children;
}
