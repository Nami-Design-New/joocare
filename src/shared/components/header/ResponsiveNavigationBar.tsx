"useClient";

import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import UserProfileCard from "./UserProfileCard";

export default function ResponsiveNavigationBar({
  toggleSideMenu,
  setToggleSideMenu,
  isAuthed,
}: {
  toggleSideMenu: boolean;
  setToggleSideMenu: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthed: boolean;
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return createPortal(
    <section className="fixed h-dvh inset-0 bg-white z-50 flex flex-col  gap-6 py-6 px-4">
      <header className="flex justify-between items-center w-full ">
        <Image src="/assets/logo_1.svg" width={70} height={30} alt="Logo" />
        <button
          className="cursor-pointer"
          onClick={() => setToggleSideMenu(false)}
        >
          <X />
        </button>
      </header>
      <nav aria-label="Main Navigation" className=" flex flex-1  ">
        <ul className="flex flex-col space-y-4">
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
      <div
        className="flex justify-between items-center gap-2 "
        role="region"
        aria-label="User Actions"
      >
        {/* <Button variant="outline" size="icon-circle" aria-label="Search">
        <Search />
      </Button> */}
        {isAuthed && <UserProfileCard />}
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
