import { getCandidateProfile } from "@/features/candidate-profile/services/profile-service";
import BasicInfoForm from "@/features/candidate-settings/components/basic-info/BasicInfoForm";
import { mapCandidateProfileToSettingsProfile } from "@/features/candidate-settings/services/basic-info-service";

const BasicInfoPage = async () => {
  const profile = await getCandidateProfile();

  if (!profile) {
    return (
      <main className="rounded-2xl bg-white p-6">
        <p className="text-muted-foreground text-sm">
          Unable to load profile information.
        </p>
      </main>
    );
  }

  return (
    <main className="rounded-2xl bg-white p-6">
      <BasicInfoForm profile={mapCandidateProfileToSettingsProfile(profile)} />
    </main>
  );
};

export default BasicInfoPage;
