import { Suspense } from 'react';
import ProjectsPage from '@/features/company-projects/components/ProjectsPage';

export default function Page() {
  return (
    <Suspense>
      <ProjectsPage />
    </Suspense>
  );
}
