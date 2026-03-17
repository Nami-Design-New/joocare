// components/contact/ContactLayout.tsx

import Breadcrumb from "./Breadcrumb";
import ContactForm from "./ContactForm";
import SideCard from "./SideCard";

export default function ContactLayout({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div className="bg-background min-h-screen pb-12">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Content */}
      <div className="border-border/60 bg-card shadow-soft mx-auto -mt-10 grid max-w-6xl grid-cols-12 gap-8 rounded-3xl border p-6 md:p-7">
        <div className="col-span-12 md:col-span-4">
          <SideCard isLoggedIn={isLoggedIn} />
        </div>

        <div className="col-span-12 md:col-span-8">
          <ContactForm isLoggedIn={isLoggedIn} />
        </div>
      </div>
    </div>
  );
}
