// components/contact/SideCard.tsx

import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import SectionTitle from "../home/components/SectionTitle";

export default function SideCard({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div className="bg-muted flex h-full flex-col rounded-3xl p-5 text-left md:p-6">
      <div className="w-fit">
        <SectionTitle sectionTitle="Contact Us" />
      </div>

      <h2 className="text-secondary my-4 text-2xl leading-tight font-bold">
        Get in Touch with us
      </h2>

      <div className="mt-3 overflow-hidden rounded-2xl">
        <img
          src={
            isLoggedIn
              ? "/assets/contact/candidate.png"
              : "/assets/contact/employer.png"
          }
          alt="illustration"
          className="w-full object-contain transition-transform duration-300 hover:scale-[1.02]"
        />
      </div>

      <button className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 w-full rounded-full px-6 py-2.5 text-sm font-semibold transition-colors">
        {isLoggedIn ? "For Candidates" : "For Employer"}
      </button>

      <div className="mt-auto pt-10">
        <p className="text-foreground mb-3 text-sm font-semibold">Follow us</p>
        <div className="flex items-center gap-2.5">
          {[Linkedin, Facebook, Instagram, Twitter].map((Icon, index) => (
            <button
              key={index}
              type="button"
              className="bg-secondary text-secondary-foreground hover:bg-primary inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors"
              aria-label="social link"
            >
              <Icon size={18} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
