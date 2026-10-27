import type { ReactNode } from 'react';
import { AssessmentCatalogProvider } from '@/features/company-assessments/hooks/useAssessmentCatalog';

export default function AssessmentsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AssessmentCatalogProvider>{children}</AssessmentCatalogProvider>;
}
