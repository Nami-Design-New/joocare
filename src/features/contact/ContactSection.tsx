"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import ContactForm from "./ContactForm";
import SideCard from "./SideCard";
import type { ContactInitialValues, ContactRole } from "./types";
import { useTranslations } from "next-intl";

export type ContactSocialLink = {
  href: string;
  platform: "linkedin" | "facebook" | "instagram" | "twitter" | "snapchat";
};

export default function ContactSection({
  authRole,
  initialValues,
  containerClassName,
  socialLinks = [],
}: {
  authRole?: ContactRole;
  initialValues?: ContactInitialValues;
  containerClassName?: string;
  socialLinks?: ContactSocialLink[];
}) {
  const t = useTranslations();
  const { data: session, status } = useSession();
  const [guestRole, setGuestRole] = useState<ContactRole>("candidate");
  const resolvedAuthRole =
    authRole ?? (session?.authRole as ContactRole | undefined);
  const isResolvingAuthRole = !authRole && status === "loading";
  const activeRole = resolvedAuthRole ?? guestRole;
  const canSwitchRole = !resolvedAuthRole && !isResolvingAuthRole;

  return (
    <div className={containerClassName}>
      <div className="col-span-12 lg:col-span-5">
        <SideCard
          socialLinks={socialLinks}
          role={activeRole}
          title={t("contactPage.contact-us")}
          subtitle={
            activeRole === "candidate"
              ? t("contactPage.get-in-touch-candidate")
              : t("contactPage.get-in-touch-employer")
          }
          imageAlt={t("contactPage.illustration-alt")}
          canSwitchRole={canSwitchRole}
          onSwitchRole={() =>
            setGuestRole((currentRole) =>
              currentRole === "candidate" ? "employer" : "candidate",
            )
          }
        />
      </div>

      <div className="col-span-12 lg:col-span-7">
        <ContactForm role={activeRole} initialValues={initialValues} />
      </div>
    </div>
  );
}
