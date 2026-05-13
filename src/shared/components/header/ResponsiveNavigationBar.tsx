"use client";

import { Link } from "@/i18n/navigation";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { createPortal } from "react-dom";
import { Button } from "../ui/button";
import UserProfileCard from "./UserProfileCard";
import { useTranslations } from "next-intl";

export default function ResponsiveNavigationBar({
  setToggleSideMenu,
  companyHeader,
}: {
  setToggleSideMenu: React.Dispatch<React.SetStateAction<boolean>>;
  companyHeader: boolean;
}) {
  const t = useTranslations();
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthed = status === "authenticated";
  const homeHref = session?.authRole === "employer" ? "/for-employers" : "/";

  return createPortal(
    <section className="fixed inset-0 z-50 flex h-dvh flex-col gap-6 bg-white px-4 py-6 lg:hidden">
      <header className="flex w-full items-center justify-between">
        <Image src="/assets/new-logo-dot.svg" width={70} height={30} alt="Logo" />
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
              href={homeHref}
              onClick={() => setToggleSideMenu(false)}
            >
              {t('header.home')}
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="nav-link"
              onClick={() => setToggleSideMenu(false)}
            >
              {t('header.about')}
            </Link>
          </li>
          <li>
            <Link
              href="/jobs"
              className="nav-link"
              onClick={() => setToggleSideMenu(false)}
            >
              {t('header.jobs')}
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="nav-link"
              onClick={() => setToggleSideMenu(false)}
            >
              {t('header.contact')}
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
              {t('header.login')}
            </Button>
            <Button
              onClick={() => router.push("/auth/candidate/register")}
              variant="outline"
              hoverStyle="slidePrimary"
              size="pill"
              className="flex-1"
            >
              {t('header.join-now')}
            </Button>
          </>
        )}
      </div>
    </section>,
    document.body,
  );
}
