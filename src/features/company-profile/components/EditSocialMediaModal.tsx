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

interface EditSocialMediaModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    companyProfileData: TCompanyProfileViewModel;
}

type FormValues = {
    linkedIn: string;
    facebook: string;
    twitter: string;
    instagram: string;
    snapchat: string;
};

export function EditSocialMediaModal({ open, onOpenChange, companyProfileData }: EditSocialMediaModalProps) {
    const { data: session } = useSession();
    const token = session?.accessToken as string;

    const { mutate: updateSocialLinks, isPending } = useUpdateSocialLinks({ token });

    const {
        register,
        handleSubmit,
        reset,
    } = useForm<FormValues>({
        defaultValues: {
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
                linkedin: data.linkedIn,
                facebook: data.facebook,
                twitter: data.twitter,
                instagram: data.instagram,
                snapchat: data.snapchat,
            },
            {
                onSuccess: () => {
                    toast.success("Social links updated successfully");
                    onOpenChange(false);
                },
                onError: (error: any) => {
                    toast.error(error?.message || "Something went wrong");
                },
            }
        );
    };


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-175 ">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col  gap-5">
                    <DialogHeader>
                        <DialogTitle className="text-[28px] text-black">Edit Online profile</DialogTitle>
                    </DialogHeader>

                    <InputField
                        id="linkedIn"
                        type="text"
                        label="LinkedIn"
                        placeholder="ex: linkedin.com/in/username"
                        icon={<Image src='/assets/icons/social-icons/linkedin.svg' alt="linkedin icon" width={20} height={20} />}
                        {...register("linkedIn")}
                    />
                    <InputField
                        id="facebook"
                        type="text"
                        label="Facebook"
                        placeholder="ex: facebook.com/username"
                        icon={<Image src='/assets/icons/social-icons/facebook.svg' alt="facebook icon" width={20} height={20} />}
                        {...register("facebook")}
                    />
                    <InputField
                        id="XTwitter"
                        type="text"
                        label="X/Twitter"
                        placeholder="ex: x.com/username"
                        icon={<Image src='/assets/icons/social-icons/twitter.svg' alt="twitter icon" width={20} height={20} />}
                        {...register("twitter")}
                    />
                    <InputField
                        id="instagram"
                        type="text"
                        label="Instagram"
                        placeholder="ex: instagram.com/username"
                        icon={<Image src='/assets/icons/social-icons/instagram.svg' alt="instagram icon" width={20} height={20} />}
                        {...register("instagram")}
                    />
                    <InputField
                        id="snapchat"
                        type="text"
                        label="Snapchat"
                        placeholder="ex: snapchat.com/username"
                        icon={<Image src='/assets/icons/social-icons/snap.svg' alt="snap icon" width={20} height={20} />}
                        {...register("snapchat")}
                    />

                    <DialogFooter className="flex justify-center! ">
                        <Button className="w-1/3" size={"pill"} type="submit" disabled={isPending}>
                            {isPending ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}