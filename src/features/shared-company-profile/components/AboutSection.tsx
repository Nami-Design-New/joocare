"use client";

import { useJobShare } from "@/features/jobs/hooks/useJobShare";
import { Button } from "@/shared/components/ui/button";
import Image from "next/image";
import { CompanyProfile } from "../company-profile.type";

export default function AboutSection({ company }: { company: CompanyProfile }) {
    const companyName = company.name ?? "this company";
    const { shareJob } = useJobShare({
        title: `Check out ${companyName} on JooCare`,
    });

    return (
        <div className="rounded-2xl bg-white flex flex-col gap-4 p-4 border">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold ">About</h3>
            </div>
            <p className="text-muted-foreground text-sm text-justify">
                {company.bio}
            </p>
            <div className="flex gap-2 justify-between items-center">
                <div className="flex gap-2">
                    {company?.linkedin && (
                        <a href={company.linkedin} target="_blank" rel="noopener noreferrer">
                            <Image
                                src="/assets/icons/linkedin-circle.svg"
                                width={30}
                                height={30}
                                alt="LinkedIn"
                            />
                        </a>
                    )}

                    {company?.facebook && (
                        <a href={company.facebook} target="_blank" rel="noopener noreferrer">
                            <Image
                                src="/assets/icons/facebook-circle.svg"
                                width={30}
                                height={30}
                                alt="Facebook"
                            />
                        </a>
                    )}

                    {company?.instagram && (
                        <a href={company.instagram} target="_blank" rel="noopener noreferrer">
                            <Image
                                src="/assets/icons/instagram-circle.svg"
                                width={30}
                                height={30}
                                alt="Instagram"
                            />
                        </a>
                    )}

                    {company?.twitter && (
                        <a href={company.twitter} target="_blank" rel="noopener noreferrer">
                            <Image
                                src="/assets/icons/x-circle.svg"
                                width={30}
                                height={30}
                                alt="X (Twitter)"
                            />
                        </a>
                    )}

                    {company?.snapchat && (
                        <a href={company.snapchat} target="_blank" rel="noopener noreferrer">
                            <Image
                                src="/assets/icons/snap-circle.svg"
                                width={30}
                                height={30}
                                alt="Snapchat"
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
                        alt="link icon"
                        width={24}
                        height={24}
                    />
                    <span className="text-lg">Share</span>
                </Button>
            </div>
        </div>
    )
}
