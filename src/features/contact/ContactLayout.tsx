"use client";

import Breadcrumb from "@/shared/components/Breadcrumb";
import ContactSection, { ContactSocialLink } from "./ContactSection";
import type { ContactInitialValues, ContactRole } from "./types";
import { useAppSelector } from "@/shared/providers/redux/hooks";
import { useTranslations } from "next-intl";

export default function ContactLayout({
  authRole,
  initialValues,
}: {
  authRole?: ContactRole;
  initialValues?: ContactInitialValues;
}) {
  const t = useTranslations();
  const settings = useAppSelector((state) => state.settings.data);
  const socialLinks = [
    { href: settings?.linkedin, platform: "linkedin" as const },
    { href: settings?.facebook, platform: "facebook" as const },
    { href: settings?.instagram, platform: "instagram" as const },
    { href: settings?.twitter, platform: "twitter" as const },
    { href: settings?.snapchat, platform: "snapchat" as const },
  ].filter((item) => Boolean(item.href));

  return (
    <div className="bg-background min-h-screen pb-12">
      <Breadcrumb
        title={t("footer.contact-us")}
        items={[
          { label: t("header.home"), href: "/" },
          { label: t("footer.contact-us") },
        ]}
      />
      <section className="layout-shell">
        <section className="layout-content">
          <ContactSection
            socialLinks={socialLinks as ContactSocialLink[]}
            authRole={authRole}
            initialValues={initialValues}
            containerClassName="bg-card shadow-soft mx-auto mt-6 grid grid-cols-12 gap-y-4 rounded-3xl border p-4 md:p-7 lg:-mt-31 lg:gap-x-8"
          />
        </section>
      </section>
    </div>
  );
}
