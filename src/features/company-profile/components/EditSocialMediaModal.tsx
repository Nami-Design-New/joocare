"use client";

import { InputField } from "@/shared/components/InputField";
import { Button } from "@/shared/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/shared/components/ui/dialog";
import Image from "next/image";
import { TCompanyProfileViewModel } from "../types";
import { toast } from "sonner";
import { useUpdateSocialLinks } from "../hooks/useUpdateSocialLinks";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

interface EditSocialMediaModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    companyProfileData: TCompanyProfileViewModel;
}

type FormValues = {
    website: string;
    linkedIn: string;
    facebook: string;
    twitter: string;
    instagram: string;
    snapchat: string;
};

export function EditSocialMediaModal({ open, onOpenChange, companyProfileData }: EditSocialMediaModalProps) {
    const t = useTranslations();
    const { data: session } = useSession();
    const token = session?.accessToken as string;

    const { mutate: updateSocialLinks, isPending } = useUpdateSocialLinks({ token });

    const {
        register,
        handleSubmit,
        reset,
    } = useForm<FormValues>({
        defaultValues: {
            website: companyProfileData?.website,
            linkedIn: companyProfileData?.linkedin,
            facebook: companyProfileData?.facebook,
            twitter: companyProfileData?.twitter,
            instagram: companyProfileData?.instagram,
            snapchat: companyProfileData?.snapchat,
        },
    });

    useEffect(() => {
        if (open) {
            reset({
                website: companyProfileData?.website,
                linkedIn: companyProfileData?.linkedin,
                facebook: companyProfileData?.facebook,
                twitter: companyProfileData?.twitter,
                instagram: companyProfileData?.instagram,
                snapchat: companyProfileData?.snapchat,
            });
        }
    }, [open, companyProfileData, reset]);

    const onSubmit = (data: FormValues) => {
        updateSocialLinks(
            {
                website: data.website,
                linkedin: data.linkedIn,
                facebook: data.facebook,
                twitter: data.twitter,
                instagram: data.instagram,
                snapchat: data.snapchat,
            },
            {
                onSuccess: () => {
                    toast.success(t("companyPage.profile.social.toasts.updated-successfully"));
                    onOpenChange(false);
                },
                onError: (error: Error) => {
                    toast.error(error?.message || t("companyPage.common.something-went-wrong"));
                },
            }
        );
    };


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-175 ">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col  gap-5">
                    <DialogHeader>
                        <DialogTitle className="text-[28px] text-black">{t("companyPage.profile.social.modal.title")}</DialogTitle>
                    </DialogHeader>

                    <InputField
                        id="website"
                        type="text"
                        label={t("companyPage.profile.social.fields.website.label")}
                        placeholder={t("companyPage.profile.social.fields.website.placeholder")}
                        icon={<Image src='/assets/icons/social-icons/globe.svg' alt={t("companyPage.profile.social.fields.website.icon-alt")} width={20} height={20} />}
                        {...register("website")}
                    />
                    <InputField
                        id="linkedIn"
                        type="text"
                        label="LinkedIn"
                        placeholder={t("companyPage.profile.social.fields.linkedin.placeholder")}
                        icon={<Image src='/assets/icons/social-icons/linkedin.svg' alt={t("companyPage.profile.social.fields.linkedin.icon-alt")} width={20} height={20} />}
                        {...register("linkedIn")}
                    />
                    <InputField
                        id="facebook"
                        type="text"
                        label="Facebook"
                        placeholder={t("companyPage.profile.social.fields.facebook.placeholder")}
                        icon={<Image src='/assets/icons/social-icons/facebook.svg' alt={t("companyPage.profile.social.fields.facebook.icon-alt")} width={20} height={20} />}
                        {...register("facebook")}
                    />
                    <InputField
                        id="XTwitter"
                        type="text"
                        label="X/Twitter"
                        placeholder={t("companyPage.profile.social.fields.twitter.placeholder")}
                        icon={<Image src='/assets/icons/social-icons/twitter.svg' alt={t("companyPage.profile.social.fields.twitter.icon-alt")} width={20} height={20} />}
                        {...register("twitter")}
                    />
                    <InputField
                        id="instagram"
                        type="text"
                        label="Instagram"
                        placeholder={t("companyPage.profile.social.fields.instagram.placeholder")}
                        icon={<Image src='/assets/icons/social-icons/instagram.svg' alt={t("companyPage.profile.social.fields.instagram.icon-alt")} width={20} height={20} />}
                        {...register("instagram")}
                    />
                    <InputField
                        id="snapchat"
                        type="text"
                        label="Snapchat"
                        placeholder={t("companyPage.profile.social.fields.snapchat.placeholder")}
                        icon={<Image src='/assets/icons/social-icons/snap.svg' alt={t("companyPage.profile.social.fields.snapchat.icon-alt")} width={20} height={20} />}
                        {...register("snapchat")}
                    />

                    <DialogFooter className="flex justify-center! ">
                        <Button className="w-1/3" size={"pill"} type="submit" disabled={isPending}>
                            {isPending ? t("common.saving") : t("common.save")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
