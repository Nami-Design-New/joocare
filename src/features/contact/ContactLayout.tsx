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
      />{" "}
      <section className="px-3 lg:px-25">
        <section className="container mx-auto">
          {/* Content */}
          <div className="bg-card shadow-soft mx-auto mt-6 grid grid-cols-12 gap-y-4 rounded-3xl border p-6 md:p-7 lg:-mt-31 lg:gap-x-8">
            <div className="col-span-12 lg:col-span-5">
              <SideCard isLoggedIn={isLoggedIn} />
            </div>

            <div className="col-span-12 lg:col-span-7">
              <ContactForm isLoggedIn={isLoggedIn} />
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}
