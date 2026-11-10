import type { ReactNode } from 'react';
import CompanyWorkspaceLayout from '@/features/company/components/CompanyWorkspaceLayout';

export default function CompanyLayout({ children }: { children: ReactNode }) {
  return <CompanyWorkspaceLayout>{children}</CompanyWorkspaceLayout>;
}
