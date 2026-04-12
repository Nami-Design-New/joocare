
import Breadcrumb from "@/shared/components/Breadcrumb";
import ContactSection from "./ContactSection";
import type { ContactInitialValues, ContactRole } from "./types";

export default function ContactLayout({
  authRole,
  initialValues,
}: {
  authRole?: ContactRole;
  initialValues?: ContactInitialValues;
}) {
  return (
    <div className="bg-background min-h-screen pb-12">
      <Breadcrumb
        title="Contact us"
        items={[{ label: "Home", href: "/" }, { label: "Contact us" }]}
      />
      <section className="px-3 lg:px-25">
        <section className="container mx-auto">
          <ContactSection
            authRole={authRole}
            initialValues={initialValues}
            containerClassName="bg-card shadow-soft mx-auto mt-6 grid grid-cols-12 gap-y-4 rounded-3xl border p-6 md:p-7 lg:-mt-31 lg:gap-x-8"
          />
        </section>
      </section>
    </div>
  );
}
