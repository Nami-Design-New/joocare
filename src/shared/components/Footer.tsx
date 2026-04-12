"use client";

import { Link } from "@/i18n/navigation";
import { Facebook, Ghost, Instagram, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import BackToTopButton from "./BackToTopButton";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { data: session, status } = useSession();
  const tFooter = useTranslations("Footer");
  const tCommon = useTranslations("Common");
  const authRole = status === "authenticated" ? session?.authRole : undefined;
  const isCandidate = authRole === "candidate";
  const isEmployer = authRole === "employer";

  const candidateLinks = isEmployer
    ? [{ href: "/jobs", label: tFooter("exploreJobs") }]
    : isCandidate
      ? [
          { href: "/jobs", label: tFooter("exploreJobs") },
          { href: "/faq", label: tCommon("faq") },
        ]
      : [
          { href: "/jobs", label: tFooter("exploreJobs") },
          { href: "/auth/candidate/register", label: tFooter("createProfile") },
          { href: "/faq", label: tCommon("faq") },
        ];

  const employerLinks = isCandidate
    ? []
    : [
        { href: "/for-employers", label: tFooter("forEmployers") },
        { href: "/for-employers#how-it-works", label: tFooter("howItWorks") },
      ];

  return (
    <footer className="bg-secondary px-3 py-12 text-white lg:px-25">
      <div className="relative container mx-auto max-w-7xl">
        <div className="relative grid grid-cols-1 gap-4 pb-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/logo-light.svg"
                alt="Joo Care Logo"
                width={140}
                height={60}
              />
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-gray-300">
              {tFooter("description")}
            </p>
          </div>

          <div className="bg-before">
            <h4>{tFooter("forCandidates")}</h4>
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

          {employerLinks.length > 0 ? (
            <div className="bg-before">
              <h4>{tFooter("forEmployers")}</h4>
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
          ) : null}

          <div className="bg-before">
            <h4>{tFooter("companyTrust")}</h4>
            <ul className="text-md mb-8 space-y-4 text-gray-300">
              <li>
                <Link href="/about" className="transition hover:text-white">
                  {tFooter("aboutJoocare")}
                </Link>
              </li>
              <li>
                <span className="cursor-not-allowed opacity-70">
                  {tFooter("dataPrivacy")}
                </span>
              </li>
              <li>
                <span className="cursor-not-allowed opacity-70">
                  {tFooter("terms")}
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-before">
            <h4>{tFooter("getInTouch")}</h4>
            <ul className="text-md mb-8 space-y-4 text-gray-300">
              <li>
                <Link href="/contact" className="transition hover:text-white">
                  {tFooter("contactUs")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="relative grid grid-cols-1 gap-4 pb-12 lg:grid-cols-5 lg:gap-12">
          <div className="order-last col-span-1 flex items-center justify-center gap-2 lg:order-first lg:gap-4">
            {[Linkedin, Facebook, Instagram, Twitter, Ghost].map((Icon, idx) => (
              <Link
                key={idx}
                href="#"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white transition hover:bg-white/20"
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
          </div>
        </div>
      </div>
      <p className="relative border-t border-[#0D0D0D73] pt-4 text-center text-lg text-white">
        {tFooter("allRightsReserved")} © {currentYear} <BackToTopButton />
      </p>
    </footer>
  );
};

export default Footer;
