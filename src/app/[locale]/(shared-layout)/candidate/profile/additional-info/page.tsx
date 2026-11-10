import AdditionalInfoPage from '@/features/candidate-additional-info/components/AdditionalInfoPage';
import ProfileTabs from '@/features/candidate-profile/components/ProfileTabs';

export default function CandidateAdditionalInfoPage() {
  return (
    <main className="flex w-full flex-col gap-6">
      <ProfileTabs />
      <AdditionalInfoPage />
    </main>
  );
}
