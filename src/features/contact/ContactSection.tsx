"use client";

import { useState } from "react";
import ContactForm from "./ContactForm";
import SideCard from "./SideCard";
import type { ContactInitialValues, ContactRole } from "./types";

export default function ContactSection({
  authRole,
  initialValues,
  containerClassName,
}: {
  authRole?: ContactRole;
  initialValues?: ContactInitialValues;
  containerClassName?: string;
}) {
  const [guestRole, setGuestRole] = useState<ContactRole>("candidate");
  const activeRole = authRole ?? guestRole;
  const canSwitchRole = !authRole;

  return (
    <div className={containerClassName}>
      <div className="col-span-12 lg:col-span-5">
        <SideCard
          role={activeRole}
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
