"use client";

import {
  Bookmark,
  ChevronDown,
  ChevronUp,
  Gauge,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  UserRoundCogIcon,
} from "lucide-react";
import Image from "next/image";
import { Button, buttonVariants } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/utils";

export default function UserDropDown({ companyHeader }: { companyHeader: boolean }) {
  const itemClass =
    "group cursor-pointer  flex items-center gap-2 text-md font-semibold text-muted-foreground " +
    "bg-transparent hover:bg-transparent focus:bg-transparent data-[highlighted]:bg-transparent " +
    "hover:text-primary focus:text-primary transition-colors";

  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-[55px] h-[55px] rounded-full relative  border-border  group"
        >
          <Image
            src="/profile-placeholder.svg"
            alt="User Avatar"
            fill
            className="object-cover"
          />{" "}
          <span className="w-6 h-6 rounded-full flex items-center justify-center absolute -bottom-2 -right-3 bg-white border border-border">
            <ChevronDown
              size={20}
              strokeWidth={1.25}
              className="
            transition-transform duration-300 ease-in-out
            group-data-[state=open]:rotate-180
          "
            />
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-62" align="start">
        {/* Profile Section */}
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex flex-col gap-2 bg-transparent hover:bg-transparent focus:bg-transparent data-[highlighted]:bg-transparent cursor-default">
            <div className="flex gap-2 w-full items-center">
              <Image
                src="/profile-placeholder.svg"
                alt="Profile"
                width={60}
                height={60}
                className="rounded-full"
              />
              <div>
                <p className="text-black font-semibold text-lg">
                  Ahmed Eltatawy
                </p>
                <p className="text-md text-muted-foreground font-normal">
                  Consultant Internist
                </p>
              </div>
            </div>

            <Link className={cn(buttonVariants(
              {
                variant: 'outline',
                size: "pill",
                hoverStyle: "slidePrimary",
              }), 'border-secondary border w-full h-8.5')}
              href={'/candidate-profile'}>
              View Profile
            </Link>

          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Menu Items */}
        <DropdownMenuGroup>
          <DropdownMenuItem className={itemClass}>
            <Settings className="w-5 h-5 text-muted-foreground group-hover:text-primary" strokeWidth={2.5} />
            <Link href={'/candidate/profile'}>Account settings</Link>
          </DropdownMenuItem>

          {companyHeader ? (<>

            <DropdownMenuItem className={itemClass}>
              <Gauge className="w-5 h-5 text-muted-foreground group-hover:text-primary" strokeWidth={2.5} />
              <p>Dashboard</p>
            </DropdownMenuItem>
            <DropdownMenuItem className={itemClass}>
              <UserRoundCogIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary" strokeWidth={2.5} />
              <p>Job Management</p>
            </DropdownMenuItem>

          </>) : (

            <DropdownMenuItem className={itemClass}>
              <Bookmark className=" text-muted-foreground group-hover:text-primary" strokeWidth={2.5} />
              <p>Saved</p>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="group cursor-pointer flex items-center gap-2 text-md font-semibold text-destructive 
            bg-transparent hover:bg-transparent focus:bg-transparent data-[highlighted]:bg-transparent  
            hover:text-destructive/80 transition-colors"
          >
            <LogOut className="w-5 h-5 text-destructive group-hover:text-destructive/80 transition-colors" />
            <p className="text-destructive group-hover:text-destructive/80">
              Log out
            </p>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
