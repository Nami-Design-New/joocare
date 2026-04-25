
import Breadcrumb from "@/shared/components/Breadcrumb";
import ContactSection, { ContactSocialLink } from "./ContactSection";
import type { ContactInitialValues, ContactRole } from "./types";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { settingService } from "@/shared/services/settings-services";

export default async function ContactLayout({
  authRole,
  initialValues,
}: {
  authRole?: ContactRole;
  initialValues?: ContactInitialValues;
}) {
  const settings = await Promise.all([
    getServerSession(authOptions),
    settingService().catch(() => null),
  ]).then(([, resolvedSettings]) => resolvedSettings);
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
        title="Contact us"
        items={[{ label: "Home", href: "/" }, { label: "Contact us" }]}
      />
      <section className="layout-shell">
        <section className="layout-content">
          <ContactSection
            socialLinks={socialLinks as ContactSocialLink[]}
            authRole={authRole}
            initialValues={initialValues}
            containerClassName="bg-card shadow-soft mx-auto mt-6 grid grid-cols-12 gap-y-4 rounded-3xl border p-6 md:p-7 lg:-mt-31 lg:gap-x-8"
          />
        </section>
      </section>
    </div>
  );
}
