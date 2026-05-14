import { Gauge, Settings, User, UserRoundCog } from "lucide-react";

export const links = [
  {
    label: "companyPage.sidebar.company-profile",
    href: "/company/company-profile",
    icon: User,
  },
  {
    label: "companyPage.sidebar.dashboard",
    href: "/company/dashboard",
    icon: Gauge,
  },
  {
    label: "companyPage.sidebar.job-management",
    href: "/company/job-management",
    icon: UserRoundCog,
  },
  {
    label: "companyPage.sidebar.account-settings",
    href: "/company/account-settings/basic-info",
    icon: Settings,
  },
];
