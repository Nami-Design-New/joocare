import {
  Activity,
  Building2,
  Database,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import type { SidebarNavGroup } from "@/shared/components/sidebar-nav/types";

export function getCompanySidebarGroups(
  companyStatus?: string,
): SidebarNavGroup[] {
  const accountSettingsHref =
    companyStatus === "Draft"
      ? "/company/account-settings/change-password"
      : "/company/account-settings/basic-info";

  return [
    {
      title: "companyPage.sidebar.groups.workspace",
      items: [
        {
          label: "companyPage.sidebar.company-profile",
          href: "/company/company-profile",
          icon: Building2,
        },
        {
          label: "companyPage.sidebar.dashboard",
          href: "/company/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "companyPage.sidebar.groups.manage-talent",
      items: [
        {
          label: "companyPage.sidebar.hiring-management",
          icon: UsersRound,
          children: [
            {
              label: "companyPage.sidebar.jobs",
              href: "/company/job-management",
              activePaths: ["/company/job"],
            },
            {
              label: "companyPage.sidebar.projects",
              href: "/company/projects",
            },
            {
              label: "companyPage.sidebar.assessments",
              href: "/company/assessments",
            },
            {
              label: "companyPage.sidebar.assessments-results",
              href: "/company/assessments-results",
            },
          ],
        },
        {
          label: "companyPage.sidebar.talent-database",
          href: "/company/talent-database",
          icon: Database,
        },
      ],
    },
    {
      title: "companyPage.sidebar.groups.administration",
      items: [
        {
          label: "companyPage.sidebar.admin-roles",
          icon: ShieldCheck,
          children: [
            {
              label: "companyPage.sidebar.users",
              href: "/company/admin-roles/users",
            },
            {
              label: "companyPage.sidebar.roles-and-permissions",
              href: "/company/admin-roles/roles-and-permissions",
            },
          ],
        },
      ],
    },
    {
      title: "companyPage.sidebar.groups.more",
      items: [
        {
          label: "companyPage.sidebar.recruiter-activity",
          href: "/company/recruiter-activity",
          icon: Activity,
        },
        {
          label: "companyPage.sidebar.account-settings",
          href: accountSettingsHref,
          icon: Settings,
        },
      ],
    },
  ];
}
