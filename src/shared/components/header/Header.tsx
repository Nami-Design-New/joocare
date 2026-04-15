"use client";

import { usePathname } from "@/i18n/navigation";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import HeaderActionsButtons from "./HeaderActionsButtons";
import ResponsiveNavigationBar from "./ResponsiveNavigationBar";

const Header = () => {
  const [toggleSideMenu, setToggleSideMenu] = useState(false);
  const path = usePathname();
  const { data: session } = useSession();
  const companyHeader = path.includes("/company");
  const isActive = (pathname: string) => path === pathname;
  const homeHref = session?.authRole === "employer" ? "/for-employers" : "/";

  const handleToggleMenu = () => {
    setToggleSideMenu((prev) => !prev);
  };

  return (
    <>
      <header className="layout-shell shadow-header sticky top-0 z-30 flex h-19 w-full items-center justify-between bg-white py-4">
        <div className="layout-content flex items-center justify-between">
          {/* Logo */}
          <div className="flex gap-1">
            <button
              onClick={handleToggleMenu}
              className="block cursor-pointer lg:hidden"
            >
              {<Menu />}
            </button>
            <Link
              href={homeHref}
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
                width={125}
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
                <Link
                  className={`nav-link ${isActive(homeHref) ? "text-primary border-primary" : ""
                    }`}
                  href={homeHref}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className={`nav-link ${isActive("/about") ? "text-primary border-primary" : ""
                    }`}
                  href="/about"
                >
                  About
                </Link>
              </li>
              {!companyHeader && (
                <li>
                  <Link
                    className={`nav-link ${isActive("/jobs") ? "text-primary border-primary" : ""
                      }`}
                    href="/jobs"
                  >
                    Jobs
                  </Link>
                </li>
              )}
              <li>
                <Link
                  className={`nav-link ${isActive("/contact") ? "text-primary border-primary" : ""
                    }`}
                  href="/contact"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
          <HeaderActionsButtons
            companyHeader={companyHeader}
          />
        </div>
      </header>
      {toggleSideMenu && (
        <ResponsiveNavigationBar
          setToggleSideMenu={setToggleSideMenu}
          companyHeader={companyHeader}
        />
      )}
    </>
  );
};

export default Header;
