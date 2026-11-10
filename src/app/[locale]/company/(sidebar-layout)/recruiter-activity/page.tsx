import { Suspense } from 'react';
import RecruiterActivityPage from '@/features/company-recruiter-activity/components/RecruiterActivityPage';

export default function Page() {
  return (
    <Suspense>
      <RecruiterActivityPage />
    </Suspense>
  );
}
