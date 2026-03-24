import { Gauge, Settings, User, UserRoundCog } from "lucide-react";

export const links = [
  {
    label: "Company Profile",
    href: "/company/company-profile",
    icon: User,
  },
  {
    label: "Dashboard",
    href: "/company/dashboard",
    icon: Gauge,
  },
  {
    label: "Job Management",
    href: "/company/job-management",
    icon: UserRoundCog,
  },
  {
    label: "Account Settings",
    href: "/company/account-settings/basic-info",
    icon: Settings,
  },
];
