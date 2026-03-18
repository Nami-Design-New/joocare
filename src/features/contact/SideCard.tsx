// components/contact/SideCard.tsx

import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import SectionTitle from "../home/components/SectionTitle";
import Image from "next/image";
import { Button } from "@/shared/components/ui/button";

type SocialItem = {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
};

type SideCardProps = {
  isLoggedIn?: boolean;
  title?: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
  buttonText?: string;
  showSocial?: boolean;
  socialItems?: SocialItem[];
};

const defaultSocialItems: SocialItem[] = [
  { icon: Linkedin, label: "LinkedIn" },
  { icon: Facebook, label: "Facebook" },
  { icon: Instagram, label: "Instagram" },
  { icon: Twitter, label: "X" },
];

export default function SideCard({
  isLoggedIn = true,
  title = "Contact Us",
  subtitle = "Get in Touch with us",
  imageSrc,
  imageAlt = "illustration",
  buttonText,
  showSocial = true,
  socialItems = defaultSocialItems,
}: SideCardProps) {
  const resolvedImageSrc =
    imageSrc ??
    (isLoggedIn
      ? "/assets/contact/employer.svg"
      : "/assets/contact/candidate.svg");

  const resolvedButtonText =
    buttonText ?? (isLoggedIn ? "For Candidates" : "For Employer");

  return (
    <div className="bg-muted flex h-full flex-col rounded-3xl p-5 text-left md:p-6">
      <div className="w-fit">
        <SectionTitle sectionTitle={title} />
        <h2 className="text-secondary my-4 text-2xl leading-tight font-bold">
          {subtitle}
        </h2>
      </div>
      <section className="flex w-full grow flex-col items-center justify-center gap-2">
        <div className="relative h-85 w-full">
          <Image src={resolvedImageSrc} alt={imageAlt} fill />
        </div>
        <Button size="pill" className="w-full">
          {resolvedButtonText}
        </Button>
      </section>

      {showSocial && (
        <div className="mt-auto pt-10">
          <p className="text-foreground mb-3 text-sm font-semibold">
            Follow us
          </p>
          <div className="flex items-center gap-2.5">
            {socialItems.map(({ icon: Icon, label }, index) => (
              <button
                key={index}
                type="button"
                className="bg-secondary text-secondary-foreground hover:bg-primary inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                aria-label={label}
              >
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
