import ExternalInvitationsPage from '@/features/company-assessments/components/assessments/ExternalInvitationsPage';

export default async function Page({ params }: { params: Promise<{ categoryId: string; assessmentId: string }> }) {
  const { categoryId, assessmentId } = await params;
  return <ExternalInvitationsPage categoryId={categoryId} assessmentId={assessmentId} />;
}
