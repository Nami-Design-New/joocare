import { getCandidateProfile } from "@/features/candidate-profile/services/profile-service";
import BasicInfoForm from "@/features/candidate-settings/components/basic-info/BasicInfoForm";
import { mapCandidateProfileToSettingsProfile } from "@/features/candidate-settings/services/basic-info-service";
import { getTranslations } from "next-intl/server";

const BasicInfoPage = async () => {
  const t = await getTranslations();
  const profile = await getCandidateProfile();

  if (!profile) {
    return (
      <main className="rounded-2xl bg-white p-2 md:p-6">
        <p className="text-muted-foreground text-sm">
          {t("candidateSettingsPage.unable-load-profile")}
        </p>
      </main>
    );
  }

  return (
    <main className="rounded-2xl bg-white p-2 md:p-6">
      <BasicInfoForm profile={mapCandidateProfileToSettingsProfile(profile)} />
    </main>
  );
};

export default BasicInfoPage;
