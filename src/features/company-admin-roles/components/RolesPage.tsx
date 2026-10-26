"use client";

import CountPageHeader from "@/shared/components/common/CountPageHeader";
import RolesTable from "./RolesTable";
import { useTranslations } from "next-intl";
import {
  sampleCompanyRoles,
} from "../data/roles.data";

export default function RolesPage() {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-6 lg:mt-4">
      <CountPageHeader
        count={sampleCompanyRoles.length}
        title={t("companyPage.roles.title")}
      />
      <RolesTable
        roles={sampleCompanyRoles}
      />
    </div>
  );
}
