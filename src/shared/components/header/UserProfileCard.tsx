"use client";

import { Link } from "@/i18n/navigation";
import { ArrowUpRight, Bookmark, Settings } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

export default function UserProfileCard() {
  const itemClass =
    "group cursor-pointer  flex items-center gap-2 text-md font-semibold text-muted-foreground " +
    "bg-transparent hover:bg-transparent focus:bg-transparent data-[highlighted]:bg-transparent " +
    "hover:text-primary focus:text-primary transition-colors";
  return (
    <section className="w-full ">
      <div className="flex gap-2 w-full items-center p-2">
        <Image
          src="/profile-placeholder.svg"
          alt="Profile"
          width={60}
          height={60}
          className="rounded-full"
        />
        <div>
          <p className="text-black font-semibold text-md">Ahmed Eltatawy</p>
          <p className="text-md text-muted-foreground font-normal">
            Consultant Internist
          </p>
          <Link
            href="/profile"
            className="text-secondary text-normal font-normal flex items-center gap-1 "
          >
            View Profile <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
      <ul className="p-2 flex flex-col gap-2 ">
        <li className={itemClass}>
          <Settings className="w-5 h-5 text-muted-foreground group-hover:text-muted-foreground" />
          <p>Account settings</p>
        </li>

        <li className={itemClass}>
          <Bookmark className="w-5 h-5 text-muted-foreground group-hover:text-muted-foreground" />
          <p>Saved</p>
        </li>
      </ul>
      <Button
        size="pill"
        variant="destructive"
        className="w-full bg-destructive text-white mt-4"
      >
        Log out
      </Button>
    </section>
  );
}
