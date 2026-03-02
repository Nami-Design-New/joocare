"use client";
import { ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { LanguageToggle } from "../LanguageToggle";
import { Button, buttonVariants } from "../ui/button";
import { useRouter } from "next/navigation";

function HeaderActionsButtons() {
  const router = useRouter();
  return (
    <div
      className="flex justify-center items-center space-x-4"
      role="region"
      aria-label="User Actions"
    >
      <Button variant="outline" size="icon-circle" aria-label="Search">
        <Search />
      </Button>

      <Button
        onClick={() => router.push("/auth/candidate/login")}
        variant="default"
        hoverStyle="slideSecondary"
        size="pill"
      >
        Login
      </Button>

      <Button
        onClick={() => router.push("/auth/candidate/register")}
        variant="outline"
        hoverStyle="slidePrimary"
        size="pill"
      >
        Join Now
      </Button>

      <LanguageToggle aria-label="Toggle Language" />

      <Link
        href="/employer"
        className={`flex items-center text-lg text-secondary justify-center ${buttonVariants(
          {
            variant: "outline",
            size: "xl",
            hoverStyle: "hoverBorder",
          },
        )}`}
      >
        For Employer <ChevronRight size={24} />
      </Link>
    </div>
  );
}

export default HeaderActionsButtons;
