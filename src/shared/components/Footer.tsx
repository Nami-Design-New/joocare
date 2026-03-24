"use client";

import { Facebook, Ghost, Instagram, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import BackToTopButton from "./BackToTopButton";
import { Link } from "@/i18n/navigation";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary px-3 py-12 text-white lg:px-25">
      <div className="relative container mx-auto max-w-7xl">
        {/* Top Section: Links & Info */}
        <div className="relative grid grid-cols-1 gap-4 pb-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          {/* Column 1: Brand Info */}
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
              An AI-powered healthcare recruitment platform supporting
              compliant, data-driven hiring across medical and life sciences
              sectors.
            </p>
          </div>

          {/* Column 2: Candidates */}
          <div className="bg-before">
            <h4>For Candidates</h4>
            <ul className="text-md space-y-4 text-gray-300">
              <li>
                <Link href="/jobs" className="transition hover:text-white">
                  Explore Jobs
                </Link>
              </li>
              <li>
                <Link href="/profile" className="transition hover:text-white">
                  Create Profile
                </Link>
              </li>
              <li>
                <Link href="/resources" className="transition hover:text-white">
                  Career Resources
                </Link>
              </li>
              <li>
                <Link href="/faq" className="transition hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Employers */}
          <div className="bg-before">
            <h4>For Employers</h4>
            <ul className="text-md space-y-4 text-gray-300">
              <li>
                <Link href="/employers" className="transition hover:text-white">
                  For Employers
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="transition hover:text-white"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/ai-solutions"
                  className="transition hover:text-white"
                >
                  AI Hiring Solutions
                </Link>
              </li>
            </ul>
          </div>

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
                <Link href="/privacy" className="transition hover:text-white">
                  Data Privacy & Security
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition hover:text-white">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
          {/* Column5:  Contact */}
          <div className="bg-before">
            <h4>Get in Touch</h4>
            <ul className="text-md mb-8 space-y-4 text-gray-300">
              <li>
                {" "}
                <Link href="/terms" className="transition hover:text-white">
                  Contacat us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Socials & Copyright */}
        <div className="relative grid grid-cols-1 gap-4 pb-12 lg:grid-cols-5 lg:gap-12">
          {/* Social Icons */}
          <div className="order-last col-span-1 flex items-center justify-center gap-2 lg:order-first lg:gap-4">
            {[Linkedin, Facebook, Instagram, Twitter, Ghost].map(
              (Icon, idx) => (
                <Link
                  key={idx}
                  href="#"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white transition hover:bg-white/20"
                >
                  <Icon size={14} color="var(--secondary)" />
                </Link>
              ),
            )}
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
        All rights reserved - JooCare © {currentYear} <BackToTopButton />
      </p>
    </footer>
  );
};

export default Footer;
