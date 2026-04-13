"use client"

import { TCompanyProfileViewModel } from "../types"
import TextSkeleton from "./TextSkeleton"

const BaseInfoSection = ({ companyProfileData, isPending }: { companyProfileData: TCompanyProfileViewModel, isPending: boolean }) => {
    return (
        <div className="rounded-2xl bg-white flex flex-col gap-5 p-4 border">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold ">Base Info</h2>
            </div>

            <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-muted-foreground">
                    Official Email
                </span>
                {isPending ? <TextSkeleton /> : <span className="text-sm font-semibold">
                    {companyProfileData?.email}
                </span>}
            </div>
            <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-muted-foreground">
                    Location
                </span>
                {isPending ? <TextSkeleton /> : <span className="text-sm font-semibold">
                    {companyProfileData?.city?.name}, {companyProfileData?.country?.name}
                </span>}
            </div>
            <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-muted-foreground">
                    Official phone number
                </span>
                {isPending ? <TextSkeleton /> : <span className="text-sm font-semibold">
                    {companyProfileData?.phone_code}{companyProfileData?.phone}
                </span>}
            </div>
            <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-muted-foreground">
                    Founded
                </span>
                {isPending ? <TextSkeleton /> : <span className="text-sm font-semibold">
                    {companyProfileData?.established_date}
                </span>}
            </div>
        </div>
    )
}

export default BaseInfoSection
