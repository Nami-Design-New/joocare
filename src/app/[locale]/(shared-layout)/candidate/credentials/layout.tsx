import { ReactNode } from "react";
import HeaderLayout from "@/shared/components/HeaderLayout";
import AddHeaderButton from "@/features/candidate-credentials/components/AddHeaderButton";
import { getTranslations } from "next-intl/server";

const CredentialsLayout = async ({ children }: { children: ReactNode }) => {
  const tCandidate = await getTranslations("Candidate");
  const navLinks = [
    { href: "/candidate/credentials/qualifications", label: tCandidate("qualifications") },
    { href: "/candidate/credentials/certificates", label: tCandidate("certificates") },
    { href: "/candidate/credentials/licenses", label: tCandidate("licenses") },
  ];
  return (
    <main className="flex flex-col space-y-6">
      <section className="flex flex-wrap justify-between gap-4 sm:items-center">
        <HeaderLayout navLinks={navLinks} />
        <AddHeaderButton />
      </section>
      {children}
    </main>
  );
};

export default CredentialsLayout;
