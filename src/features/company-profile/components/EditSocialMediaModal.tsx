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

interface EditSocialMediaModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    companyProfileData: TCompanyProfileViewModel;
}
export function EditSocialMediaModal({ open, onOpenChange, companyProfileData }: EditSocialMediaModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <form>
                <DialogContent className="max-w-175 flex flex-col  gap-5">
                    <DialogHeader>
                        <DialogTitle className="text-[28px] text-black">Edit Online profile</DialogTitle>
                    </DialogHeader>

                    <InputField
                        id="linkedIn"
                        type="text"
                        label="LinkedIn"
                        placeholder="ex: linkedin.com/in/username"
                        defaultValue={companyProfileData?.linkedin}
                        icon={<Image src='/assets/icons/social-icons/linkedin.svg' alt="linkedin icon" width={20} height={20} />
                        }
                    // {...register("linkedIn")}
                    // error={errors.linkedIn?.message?.toString()}
                    />
                    <InputField
                        id="facebook"
                        type="text"
                        label="Facebook"
                        placeholder="ex: facebook.com/username"
                        defaultValue={companyProfileData?.facebook}
                        icon={<Image src='/assets/icons/social-icons/facebook.svg' alt="facebook icon" width={20} height={20} />
                        }
                    // {...register("facebook")}
                    // error={errors.facebook?.message?.toString()}
                    />
                    <InputField
                        id="XTwitter"
                        type="text"
                        label="X/Twitter"
                        placeholder="ex: x.com/username"
                        defaultValue={companyProfileData?.twitter}
                        icon={<Image src='/assets/icons/social-icons/twitter.svg' alt="twitter icon" width={20} height={20} />
                        }
                    // {...register("XTwitter")}
                    // error={errors.XTwitter?.message?.toString()}
                    />
                    <InputField
                        id="instagram"
                        type="text"
                        label="Instagram"
                        placeholder="ex: instagram.com/username"
                        defaultValue={companyProfileData?.instagram}
                        icon={<Image src='/assets/icons/social-icons/instagram.svg' alt="instagram icon" width={20} height={20} />
                        }
                    // {...register("instagram")}
                    // error={errors.instagram?.message?.toString()}
                    />
                    <InputField
                        id="snapchat"
                        type="text"
                        label="Snapchat"
                        placeholder="ex: snapchat.com/username"
                        defaultValue={companyProfileData?.snapchat}
                        icon={<Image src='/assets/icons/social-icons/snap.svg' alt="snap icon" width={20} height={20} />
                        }
                    // {...register("snapchat")}
                    // error={errors.snapchat?.message?.toString()}
                    />

                    <DialogFooter className="flex justify-center! ">
                        <Button className="w-1/3" size={"pill"} type="submit">Save</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}