import { Link } from "@/i18n/navigation"
import { Trash2 } from "lucide-react"
import Image from "next/image"
import TextSkeleton from "./TextSkeleton";
import { useDeleteSocialLinks } from "../hooks/useDeleteSocialLinks";
import { useSession } from "next-auth/react";
import { useState } from "react";
import DeleteModal from "@/shared/components/modals/DeleteModal";
import { useTranslations } from "next-intl";

interface ISocialMediaProps {
    title: string;
    link: string;
    src: string;
    isPending: boolean;
}

const SocialMediaCard = ({ link, title, src, isPending }: ISocialMediaProps) => {
    const t = useTranslations();
    const { data: session } = useSession();
    const [deleteSocialMedia, setDeleteSocialMedia] = useState(false)

    const token = session?.accessToken as string;
    const { mutate: deleteSocialLinks, isPending: isPendingDelete } = useDeleteSocialLinks({ token });

    const handleDelete = ({ title }: { title: string }) => {
        if (title === "X/Twitter") {
            deleteSocialLinks({ social: "twitter" });
        } else {
            deleteSocialLinks({ social: title.toLowerCase() });
        }
        setDeleteSocialMedia(false)
    }

    return (<>
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0 flex-1">
                <Image
                    src={src}
                    alt={t("companyPage.profile.social.icon-alt")}
                    width={35}
                    height={35}
                />

                <div className="min-w-0">
                    <h5 className="text-sm">{title}</h5>

                    <Link
                        href={link}
                        title={link}
                        className="text-primary text-sm block truncate hover:underline"
                    >
                        {isPending ? <TextSkeleton /> : link}
                    </Link>
                </div>
            </div>

            <Trash2
                className="text-red-400 cursor-pointer shrink-0"
                width={20}
                height={20}
                onClick={() => setDeleteSocialMedia(true)}
            />
        </div>
        <DeleteModal
            open={deleteSocialMedia}
            onOpenChange={setDeleteSocialMedia}
            title={t("companyPage.profile.social.delete.title")}
            description={t("companyPage.profile.social.delete.description")}
            cancelLabel={t("common.back")}
            confirmLabel={t("companyPage.profile.social.delete.confirm")}
            onConfirm={() => handleDelete({ title })}
            isLoading={isPendingDelete}
        />
    </>
    )
}

export default SocialMediaCard
