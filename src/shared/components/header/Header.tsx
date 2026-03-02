import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { ChevronRight, Search } from "lucide-react";
import { LanguageToggle } from "../LanguageToggle";
import HeaderActionsButtons from "./HeaderActionsButtons";

const Header = () => {
  return (
    <header className="flex justify-between items-center py-4 w-full shadow-header">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" aria-label="Go to homepage">
          <Image
            src="/assets/logo_1.svg"
            alt="Joo Care Logo"
            width={100}
            height={100}
            priority
          />
        </Link>

        {/* Main Navigation */}
        <nav aria-label="Main Navigation" className="flex justify-center">
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

        <HeaderActionsButtons />
      </div>
    </header>
  );
};

export default Header;
