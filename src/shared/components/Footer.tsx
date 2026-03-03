"use client";
import logo from "@/assets/logo-light.svg";
import footer1 from "@/assets/footer1.svg";

import {
  ArrowUp,
  Facebook,
  Ghost,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-secondary text-white py-12 ">
      <div className="container mx-auto">
        {/* Top Section: Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12  pb-12 relative">
          {/* Column 1: Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Image src={logo} alt="Joo Care Logo" width={140} height={60} />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
              An AI-powered healthcare recruitment platform supporting
              compliant, data-driven hiring across medical and life sciences
              sectors.
            </p>
          </div>

          {/* Column 2: Candidates */}
          <div className="bg-before">
            <h4 className="font-bold text-xl mb-6">For Candidates</h4>
            <ul className="space-y-4 text-gray-300 text-md">
              <li>
                <Link href="/jobs" className="hover:text-white transition">
                  Explore Jobs
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white transition">
                  Create Profile
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-white transition">
                  Career Resources
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Employers */}
          <div className="bg-before">
            <h4 className="font-bold text-lg mb-6">For Employers</h4>
            <ul className="space-y-4 text-gray-300 text-md">
              <li>
                <Link href="/employers" className="hover:text-white transition">
                  For Employers
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="hover:text-white transition"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/ai-solutions"
                  className="hover:text-white transition"
                >
                  AI Hiring Solutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company*/}
          <div className="bg-before">
            <h4 className="font-bold text-lg mb-6">Company & Trust</h4>
            <ul className="space-y-4 text-gray-300 text-md mb-8">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Joocare
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Data Privacy & Security
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
          {/* Column5:  Contact */}
          <div className="bg-before">
            <h4 className="font-bold text-lg mb-4">Get in Touch</h4>
            <ul className="space-y-4 text-gray-300 text-md mb-8">
              <li>
                {" "}
                <Link href="/terms" className="hover:text-white transition">
                  Contacat us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Socials & Copyright */}
        <div className="grid grid-cols-5 gap-12  pb-12 relative">
          {/* Social Icons */}
          <div className="flex col-span-1  gap-4">
            {[Linkedin, Facebook, Instagram, Twitter, Ghost].map(
              (Icon, idx) => (
                <Link
                  key={idx}
                  href="#"
                  className="w-7 h-7 rounded-full border border-white/20 flex items-center  bg-white justify-center hover:bg-white/20 transition"
                >
                  <Icon size={14} color="var(--secondary)" />
                </Link>
              ),
            )}
          </div>
          <div className="relative col-span-4 h-7  w-full">
            <Image
              src={footer1}
              alt="Joo Care Logo"
              fill
              className="ml-4 md:ml-0"
            />
          </div>
        </div>

        {/* Back to Top Button */}
        {/* <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 md:static bg-[#28A745] hover:bg-green-600 p-3 rounded-lg transition-all shadow-lg"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button> */}
      </div>{" "}
      {/* Copyright */}
      <p className="text-white  text-lg  text-center pt-4  border-[#0D0D0D73] border-t">
        All rights reserved - JooCare © {currentYear}
      </p>
    </footer>
  );
};

export default Footer;
