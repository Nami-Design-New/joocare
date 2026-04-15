import { authOptions } from "@/auth";
import { Link } from "@/i18n/navigation";
import { Facebook, Ghost, Instagram, Linkedin, Twitter } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { settingService } from "../services/settings-services";
import BackToTopButton from "./BackToTopButton";

const Footer = async () => {
  const currentYear = new Date().getFullYear();
  const [session, settings] = await Promise.all([
    getServerSession(authOptions),
    settingService().catch(() => null),
  ]);
  const authRole = session?.authRole;
  const isCandidate = authRole === "candidate";
  const isEmployer = authRole === "employer";
  const footerLogo = settings?.footer_logo || "/assets/logo-light.svg";
  const footerText =
    settings?.footer_text ||
    "An AI-powered healthcare recruitment platform supporting compliant, data-driven hiring across medical and life sciences sectors.";
  const copyrightText =
    settings?.copyright || `All rights reserved - JooCare © ${currentYear}`;
  const socialLinks = [
    { href: settings?.linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: settings?.facebook, icon: Facebook, label: "Facebook" },
    { href: settings?.instagram, icon: Instagram, label: "Instagram" },
    { href: settings?.twitter, icon: Twitter, label: "Twitter" },
    { href: settings?.snapchat, icon: Ghost, label: "Snapchat" },
  ].filter((item) => Boolean(item.href));

  const candidateLinks = isEmployer
    ? [
      { href: "/jobs", label: "Explore Jobs" },
    ]
    : isCandidate
      ? [
        { href: "/jobs", label: "Explore Jobs" },
        { href: "/faq", label: "FAQ" },
      ]
      : [
        { href: "/jobs", label: "Explore Jobs" },
        { href: "/auth/candidate/register", label: "Create Profile" },
        { href: "/faq", label: "FAQ" },
      ];

  const employerLinks = isCandidate
    ? []
    : [
      { href: "/for-employers", label: "For Employers" },
      { href: "/for-employers#how-it-works", label: "How It Works" },
    ];

  return (
    <footer className="layout-shell bg-secondary py-12 text-white">
      <div className="layout-content relative">
        {/* Top Section: Links & Info */}
        <div className="relative grid grid-cols-1 gap-4 pb-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          {/* Column 1: Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Image
                src={"/assets/logo-light.svg"}
                alt="Joo Care Logo"
                width={140}
                height={60}
              />
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-gray-300">
              {footerText}
            </p>
          </div>

          {/* Column 2: Candidates */}
          <div className="bg-before">
            <h4>For Candidates</h4>
            <ul className="text-md space-y-4 text-gray-300">
              {candidateLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Employers */}
          {employerLinks.length > 0 ? (
            <div className="bg-before">
              <h4>For Employers</h4>
              <ul className="text-md space-y-4 text-gray-300">
                {employerLinks.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="transition hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            null
          )}

          {/* Column 4: Company*/}
          <div className="bg-before">
            <h4>Company & Trust</h4>
            <ul className="text-md mb-8 space-y-4 text-gray-300">
              <li>
                <Link href="/about" className="transition hover:text-white">
                  About Joocare
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="transition hover:text-white">
                  Data Privacy & Security
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="transition hover:text-white">
                  Terms & Conditions
                </Link>
              </li>

            </ul>
          </div>

          <div className="bg-before">
            <h4>Get in Touch</h4>
            <ul className="text-md mb-8 space-y-4 text-gray-300">
              <li>
                <Link href="/contact" className="transition hover:text-white">
                  Contact us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Socials & Copyright */}
        <div className="relative grid grid-cols-1 gap-4 pb-12 lg:grid-cols-5 lg:gap-12">
          {/* Social Icons */}
          <div className="order-last col-span-1 flex items-center justify-center gap-2 lg:order-first lg:gap-4">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <Link
                key={label}
                href={href!}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white transition hover:bg-white/50"
              >
                <Icon size={14} color="var(--secondary)" />
              </Link>
            ))}
          </div>
          <div className="relative col-span-1 h-7 w-full lg:col-span-4">
            <Image
              src="/assets/footer1.svg"
              alt="Joo Care Logo"
              fill
              className="ml-0"
            />
          </div>{" "}
        </div>
      </div>{" "}
      {/* Copyright */}
      <p className="relative border-t border-[#0D0D0D73] pt-4 text-center text-lg text-white">
        {copyrightText} <BackToTopButton />
      </p>
    </footer>
  );
};

export default Footer;
