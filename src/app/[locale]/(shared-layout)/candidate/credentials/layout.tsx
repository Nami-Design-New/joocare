import { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

import { navLinks } from "@/features/candidate-credentials/constants";
import HeaderLayout from "@/shared/components/HeaderLayout";
import AddHeaderButton from "@/features/candidate-credentials/components/AddHeaderButton";

const CredentialsLayout = async ({ children }: { children: ReactNode }) => {
  const t = await getTranslations();
  const translatedNavLinks = navLinks.map((link) => ({
    ...link,
    label: t(link.label),
  }));

  return (
    <main className="flex flex-col space-y-6">
      <section className="flex flex-wrap justify-between gap-4 sm:items-center">
        <HeaderLayout navLinks={translatedNavLinks} />
        <AddHeaderButton />
      </section>
      {children}
    </main>
  );
};

export default CredentialsLayout;
