"use client";

import { TCompanyProfile } from "@/features/company-profile/types"
import { Badge } from "@/shared/components/ui/badge"
import Image from "next/image"
import { useTranslations } from "next-intl"

const AccountUnderReview = ({ companyProfileData }: { companyProfileData: TCompanyProfile }) => {
    const t = useTranslations();
    return (
        <section className="bg-background border rounded-2xl flex flex-col gap-3 py-3 px-4">
            <div className="flex gap-2 w-full items-center ">
                <Image
                    src={companyProfileData?.image || "/assets/new-logo-dot.svg"}
                    alt={t("companyPage.sidebar.profile-image-alt")}
                    width={60}
                    height={60}
                    className="rounded-full w-15 h-15 object-contain"
                />
                <div>
                    <p className="text-black font-semibold text-base">
                        {companyProfileData?.name}
                    </p>
                    <p className="text-base font-normal mt-1">
                        {companyProfileData?.domain?.title}
                    </p>
                </div>
            </div>
            {companyProfileData?.status === "Pending" && (
                <p className="text-sm text-muted-foreground text-wrap">
                    {companyProfileData?.bio?.slice(0, 100)}
                </p>
            )}
            {companyProfileData?.status === "Rejected" && (
                <p className="text-sm text-muted-foreground text-wrap">
                    {companyProfileData?.rejection_reason}
                </p>
            )}
            {
                companyProfileData?.status === "Pending" && (
                    <Badge className="bg-warning-bg text-warning justify-start text-base  py-1 px-4 mt-2 w-full font-normal whitespace-normal">
                        {t("companyPage.sidebar.account-under-review")}
                    </Badge>
                )
            }
            {
                companyProfileData?.status === "Rejected" && (
                    <Badge className="bg-red-50 text-red-500 justify-start text-base  py-1 px-4 mt-2 w-full font-normal whitespace-normal">
                        {t("companyPage.sidebar.account-review-rejected")}
                    </Badge>
                )
            }
        </section>
    )
}

export default AccountUnderReview
