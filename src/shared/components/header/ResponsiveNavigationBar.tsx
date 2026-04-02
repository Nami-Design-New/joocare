"use client";

import { Link } from "@/i18n/navigation";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { Button } from "../ui/button";
import UserProfileCard from "./UserProfileCard";
import { useState } from "react";

export default function ResponsiveNavigationBar({
  toggleSideMenu,
  setToggleSideMenu,
  isAuthed,
  companyHeader,
}: {
  toggleSideMenu: boolean;
  setToggleSideMenu: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthed: boolean;
  companyHeader: boolean;
}) {
  const router = useRouter();

  return createPortal(
    <section className="fixed inset-0 z-50 flex h-dvh flex-col gap-6 bg-white px-4 py-6 lg:hidden">
      <header className="flex w-full items-center justify-between">
        <Image src="/assets/logo_1.svg" width={70} height={30} alt="Logo" />
        <button
          className="cursor-pointer"
          onClick={() => setToggleSideMenu(false)}
        >
          <X />
        </button>
      </header>
      <nav aria-label="Main Navigation" className="flex flex-1">
        <ul className="flex flex-col space-y-4">
          <li>
            <Link
              className="nav-link"
              href="/"
              onClick={() => setToggleSideMenu(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="nav-link"
              onClick={() => setToggleSideMenu(false)}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/jobs"
              className="nav-link"
              onClick={() => setToggleSideMenu(false)}
            >
              Jobs
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="nav-link"
              onClick={() => setToggleSideMenu(false)}
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>
      <div
        className="flex items-center justify-between gap-2"
        role="region"
        aria-label="User Actions"
      >
        {/* <Button variant="outline" size="icon-circle" aria-label="Search">
        <Search />
      </Button> */}
        {isAuthed && <UserProfileCard companyHeader={companyHeader} />}
        {!isAuthed && (
          <>
            {" "}
            <Button
              onClick={() => router.push("/auth/candidate/login")}
              variant="default"
              hoverStyle="slideSecondary"
              size="pill"
              className="flex-1"
            >
              Login
            </Button>
            <Button
              onClick={() => router.push("/auth/candidate/register")}
              variant="outline"
              hoverStyle="slidePrimary"
              size="pill"
              className="flex-1"
            >
              Join Now
            </Button>
          </>
        )}
      </div>
    </section>,
    document.body,
  );
}
