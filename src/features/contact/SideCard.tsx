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
  linkedin: { src: "/assets/icons/social-icons/linkedin-contact.svg", label: "LinkedIn" },
  facebook: { src: "/assets/icons/social-icons/facebook-contact.svg", label: "Facebook" },
  instagram: { src: "/assets/icons/social-icons/instagram-contact.svg", label: "Instagram" },
  twitter: { src: "/assets/icons/social-icons/twitter-contact.svg", label: "X" },
  snapchat: { src: "/assets/icons/social-icons/snapchat-contact.svg", label: "Snapchat" },
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
      ? "/assets/contact/employer.png"
      : "/assets/contact/candidate.png");

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
        <div className="relative h-75 w-full">
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
              const { src: srcImg, label } = socialItems[platform];

              return (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:scale-105  h-10 w-10"
                  aria-label={label}
                >
                  <Image
                    src={srcImg}
                    alt={label}
                    width={40}
                    height={40}
                  />
                </a>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
