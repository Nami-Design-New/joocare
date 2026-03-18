// components/contact/ContactLayout.tsx

import Breadcrumb from "@/shared/components/Breadcrumb";
import ContactForm from "./ContactForm";
import SideCard from "./SideCard";

export default function ContactLayout({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div className="bg-background min-h-screen pb-12">
      {/* Breadcrumb */}
      <Breadcrumb
        title="Contact us"
        items={[{ label: "Home", href: "/" }, { label: "Contact us" }]}
      />

      {/* Content */}
      <div className="bg-card shadow-soft mx-auto -mt-31 grid max-w-6xl grid-cols-12 gap-8 rounded-3xl border p-6 md:p-7">
        <div className="col-span-12 md:col-span-5">
          <SideCard isLoggedIn={isLoggedIn} />
        </div>

        <div className="col-span-12 md:col-span-7">
          <ContactForm isLoggedIn={isLoggedIn} />
        </div>
      </div>
    </div>
  );
}
