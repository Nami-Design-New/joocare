"use client";

import { Link } from "@/i18n/navigation";
import {
  ArrowUpRight,
  Bookmark,
  Gauge,
  Settings,
  UserRoundCogIcon,
} from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

export default function UserProfileCard({
  companyHeader,
}: {
  companyHeader: boolean;
}) {
  const itemClass =
    "group cursor-pointer  flex items-center gap-2 text-md font-semibold text-muted-foreground " +
    "bg-transparent hover:bg-transparent focus:bg-transparent data-[highlighted]:bg-transparent " +
    "hover:text-primary focus:text-primary transition-colors";
  return (
    <section className="w-full">
      <div className="flex w-full items-center gap-2 p-2">
        <Image
          src="/profile-placeholder.svg"
          alt="Profile"
          width={60}
          height={60}
          className="rounded-full"
        />
        <div>
          <p className="text-md font-semibold text-black">Ahmed Eltatawy</p>
          <p className="text-md text-muted-foreground font-normal">
            Consultant Internist
          </p>
          <Link
            href="/candidate/profile"
            className="text-secondary text-normal flex items-center gap-1 font-normal"
          >
            View Profile <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
      <ul className="flex flex-col gap-2 p-2">
        <li className={itemClass}>
          <Settings className="text-muted-foreground group-hover:text-muted-foreground h-5 w-5" />
          <p>Account settings</p>
        </li>
        {companyHeader ? (
          <>
            <li className={itemClass}>
              <Gauge
                className="text-muted-foreground group-hover:text-primary h-5 w-5"
                strokeWidth={2.5}
              />
              <p>Dashboard</p>
            </li>
            <li className={itemClass}>
              <UserRoundCogIcon
                className="text-muted-foreground group-hover:text-primary h-5 w-5"
                strokeWidth={2.5}
              />
              <p>Job Management</p>
            </li>
          </>
        ) : (
          <li className={itemClass}>
            <Bookmark className="text-muted-foreground group-hover:text-muted-foreground h-5 w-5" />
            <p>Saved</p>
          </li>
        )}
      </ul>
      <Button
        size="pill"
        variant="destructive"
        className="bg-destructive mt-4 w-full text-white"
      >
        Log out
      </Button>
    </section>
  );
}
