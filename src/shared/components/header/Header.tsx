"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ResponsiveNavigationBar from "./ResponsiveNavigationBar";
import HeaderActionsButtons from "./HeaderActionsButtons";

const Header = () => {
  const [toggleSideMenu, setToggleSideMenu] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const handleToggleMenu = () => {
    setToggleSideMenu((prev) => !prev);
  };
  return (
    <>
      <header className="flex sticky top-0 justify-between bg-white z-30 items-center py-4  px-3 lg:px-2 w-full shadow-header">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex gap-2 items-center justify-center"
            aria-label="Go to homepage"
          >
            <button
              onClick={handleToggleMenu}
              className="block cursor-pointer lg:hidden"
            >
              {<Menu />}
            </button>
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
              <li>
                <Link href="/jobs" className="nav-link">
                  Jobs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="nav-link">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
          <HeaderActionsButtons isAuthed={isAuthed} />
        </div>
      </header>
      {toggleSideMenu && (
        <ResponsiveNavigationBar
          toggleSideMenu={toggleSideMenu}
          setToggleSideMenu={setToggleSideMenu}
          isAuthed={isAuthed}
        />
      )}
    </>
  );
};

export default Header;
