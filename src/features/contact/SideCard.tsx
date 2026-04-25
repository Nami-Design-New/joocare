// components/contact/SideCard.tsx

import {
  Facebook,
  Ghost,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import SectionTitle from "../home/components/SectionTitle";
import Image from "next/image";
import { Button } from "@/shared/components/ui/button";
import type { ContactRole } from "./types";

type SocialPlatform =
  | "linkedin"
  | "facebook"
  | "instagram"
  | "twitter"
  | "snapchat";

type SocialLink = {
  href: string;
  platform: SocialPlatform;
};

type SideCardProps = {
  role?: ContactRole;
  canSwitchRole?: boolean;
  onSwitchRole?: () => void;
  title?: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
  buttonText?: string;
  showSocial?: boolean;
  socialLinks?: SocialLink[];
};

const socialItems = {
  linkedin: { icon: Linkedin, label: "LinkedIn" },
  facebook: { icon: Facebook, label: "Facebook" },
  instagram: { icon: Instagram, label: "Instagram" },
  twitter: { icon: Twitter, label: "X" },
  snapchat: { icon: Ghost, label: "Snapchat" },
};

export default function SideCard({
  role = "candidate",
  canSwitchRole = false,
  onSwitchRole,
  title = "Contact Us",
  subtitle = "Get in Touch with us",
  imageSrc,
  imageAlt = "illustration",
  buttonText,
  showSocial = true,
  socialLinks = [],
}: SideCardProps) {
  const resolvedImageSrc =
    imageSrc ??
    (role === "employer"
      ? "/assets/contact/employer.svg"
      : "/assets/contact/candidate.svg");

  const resolvedButtonText =
    buttonText ?? (role === "employer" ? "For Candidate" : "For Employer");

  return (
    <div className="bg-muted flex h-full flex-col rounded-3xl p-5 text-left lg:p-6">
      <div className="w-fit">
        <SectionTitle sectionTitle={title} />
        <h2 className="text-secondary my-4 text-2xl leading-tight font-bold">
          {subtitle}
        </h2>
      </div>
      <section className="flex w-full grow flex-col items-center justify-center gap-2">
        <div className="relative h-48 w-full xl:h-95">
          <Image src={resolvedImageSrc} alt={imageAlt} fill />
        </div>
        {canSwitchRole ? (
          <Button size="pill" className="w-full" onClick={onSwitchRole}>
            {resolvedButtonText}
          </Button>
        ) : null}
      </section>

      {showSocial && socialLinks.length > 0 ? (
        <div className="mt-auto pt-10">
          <p className="text-foreground mb-3 text-sm font-semibold">
            Follow us
          </p>
          <div className="flex items-center gap-2.5">
            {socialLinks.map(({ href, platform }) => {
              const { icon: Icon, label } = socialItems[platform];

              return (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-secondary text-secondary-foreground hover:bg-primary inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                  aria-label={label}
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
