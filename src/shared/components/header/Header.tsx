"use client";

import { usePathname } from "@/i18n/navigation";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import HeaderActionsButtons from "./HeaderActionsButtons";
import ResponsiveNavigationBar from "./ResponsiveNavigationBar";

const Header = () => {
  const [toggleSideMenu, setToggleSideMenu] = useState(false);
  const [isAuthed, setIsAuthed] = useState(true);
  const path = usePathname();
  const companyHeader = path.includes("/company");

  const handleToggleMenu = () => {
    setToggleSideMenu((prev) => !prev);
  };
  return (
    <>
      <header className="shadow-header sticky top-0 z-30 flex min-h-21.75 w-full items-center justify-between bg-white px-3 py-4 lg:px-25">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex gap-1">
            <button
              onClick={handleToggleMenu}
              className="block cursor-pointer lg:hidden"
            >
              {<Menu />}
            </button>
            <Link
              href="/"
              className="flex items-center justify-center gap-2"
              aria-label="Go to homepage"
            >
              <Image
                src="/assets/logo_1.svg"
                alt="Joo Care Logo"
                width={70}
                height={30}
                priority
                className="block lg:hidden"
              />
              <Image
                src="/assets/logo_1.svg"
                alt="Joo Care Logo"
                width={100}
                height={100}
                priority
                className="hidden lg:block"
              />
            </Link>
          </div>

          {/* Main Navigation */}
          <nav
            aria-label="Main Navigation"
            className="hidden justify-center lg:flex"
          >
            <ul className="flex justify-center space-x-4">
              <li>
                <Link className="nav-link" href="/">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="nav-link">
                  About
                </Link>
              </li>
              {!companyHeader && (
                <li>
                  <Link href="/jobs" className="nav-link">
                    Jobs
                  </Link>
                </li>
              )}
              <li>
                <Link href="/contact" className="nav-link">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
          <HeaderActionsButtons
            isAuthed={isAuthed}
            companyHeader={companyHeader}
          />
        </div>
      </header>
      {toggleSideMenu && (
        <ResponsiveNavigationBar
          toggleSideMenu={toggleSideMenu}
          setToggleSideMenu={setToggleSideMenu}
          isAuthed={isAuthed}
          companyHeader={companyHeader}
        />
      )}
    </>
  );
};

export default Header;
