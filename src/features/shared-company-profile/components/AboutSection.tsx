"use client";

import { useJobShare } from "@/features/jobs/hooks/useJobShare";
import { Button } from "@/shared/components/ui/button";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { CompanyProfile } from "../company-profile.type";

export default function AboutSection({ company }: { company: CompanyProfile }) {
    const t = useTranslations();
    const companyName = company.name ?? t("sharedCompanyProfilePage.this-company");
    const { shareJob } = useJobShare({
        title: t("sharedCompanyProfilePage.share-company-title", { companyName }),
    });
    console.log(company);

    return (
        <div className="rounded-2xl bg-white flex flex-col gap-4 p-4 border">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold ">{t("sharedCompanyProfilePage.about")}</h3>
            </div>
            <p className="text-muted-foreground text-sm text-justify">
                {company.bio}
            </p>
            <div className="flex gap-2 justify-between items-center">
                <div className="flex gap-2">
                    {company?.website && (
                        <a href={company.website} target="_blank" rel="noopener noreferrer">
                            <Image
                                src="/assets/icons/social-icons/globe-about.svg"
                                width={30}
                                height={30}
                                alt="website"
                            />
                        </a>
                    )}
                    {company?.linkedin && (
                        <a href={company.linkedin} target="_blank" rel="noopener noreferrer">
                            <Image
                                src="/assets/icons/social-icons/linkedin-about.svg"
                                width={30}
                                height={30}
                                alt={t("sharedCompanyProfilePage.linkedin")}
                            />
                        </a>
                    )}

                    {company?.facebook && (
                        <a href={company.facebook} target="_blank" rel="noopener noreferrer">
                            <Image
                                src="/assets/icons/social-icons/facebook-about.svg"
                                width={30}
                                height={30}
                                alt={t("sharedCompanyProfilePage.facebook")}
                            />
                        </a>
                    )}

                    {company?.instagram && (
                        <a href={company.instagram} target="_blank" rel="noopener noreferrer">
                            <Image
                                src="/assets/icons/social-icons/instagram-about.svg"
                                width={30}
                                height={30}
                                alt={t("sharedCompanyProfilePage.instagram")}
                            />
                        </a>
                    )}

                    {company?.twitter && (
                        <a href={company.twitter} target="_blank" rel="noopener noreferrer">
                            <Image
                                src="/assets/icons/social-icons/twitter-about.svg"
                                width={30}
                                height={30}
                                alt={t("sharedCompanyProfilePage.twitter")}
                            />
                        </a>
                    )}

                    {company?.snapchat && (
                        <a href={company.snapchat} target="_blank" rel="noopener noreferrer">
                            <Image
                                src="/assets/icons/social-icons/snap-about.svg"
                                width={30}
                                height={30}
                                alt={t("sharedCompanyProfilePage.snapchat")}
                            />
                        </a>
                    )}
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    className="text-primary bg-accent hover:bg-accent flex items-center gap-2 rounded-full px-4 py-2"
                    onClick={() => void shareJob()}
                >
                    <Image
                        src="/assets/icons/pin-link-icon.svg"
                        alt={t("sharedCompanyProfilePage.link-icon")}
                        width={24}
                        height={24}
                    />
                    <span className="text-lg">{t("jobsPage.share")}</span>
                </Button>
            </div>
        </div>
    )
}
