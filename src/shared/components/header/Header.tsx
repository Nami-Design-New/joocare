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
  const companyHeader = path.includes('/company')

  const handleToggleMenu = () => {
    setToggleSideMenu((prev) => !prev);
  };
  return (
    <>
      <header className="flex sticky top-0 justify-between bg-white z-30 items-center py-4  px-3 lg:px-2 w-full shadow-header min-h-[87px]">
        <div className="container mx-auto flex justify-between items-center">
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
              className="flex gap-2 items-center justify-center"
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
            className=" hidden lg:flex justify-center"
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
              {!companyHeader && <li>
                <Link href="/jobs" className="nav-link">
                  Jobs
                </Link>
              </li>}
              <li>
                <Link href="/contact" className="nav-link">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
          <HeaderActionsButtons isAuthed={isAuthed} companyHeader={companyHeader} />
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
