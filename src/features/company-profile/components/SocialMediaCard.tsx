import { Link } from "@/i18n/navigation"
import { Trash2 } from "lucide-react"
import Image from "next/image"
import TextSkeleton from "./TextSkeleton";
import { useDeleteSocialLinks } from "../hooks/useDeleteSocialLinks";
import { useSession } from "next-auth/react";

interface ISocialMediaProps {
    title: string;
    link: string;
    src: string;
    isPending: boolean;
}

const SocialMediaCard = ({ link, title, src, isPending }: ISocialMediaProps) => {
    const { data: session } = useSession();
    const token = session?.accessToken as string;
    const { mutate: deleteSocialLinks, isPending: isPendingDelete } = useDeleteSocialLinks({ token });

    const handleDelete = ({ title }: { title: string }) => {
        console.log("titel", title);
        if (title === "X/Twitter") {
            deleteSocialLinks({ social: "twitter" });
        } else {
            deleteSocialLinks({ social: title.toLowerCase() });
        }
    }

    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
                <Image src={src} alt="facebook icon" width={35} height={35} />
                <div>
                    <h5 className="text-sm">{title}</h5>
                    <Link href={`${link}`} className="text-primary text-sm w-full">
                        {isPending ? <TextSkeleton /> : link}
                    </Link>
                </div>
            </div>
            <Trash2 className="text-red-400 cursor-pointer" width={20} height={20} onClick={() => handleDelete({ title })} />
        </div>
    )
}

export default SocialMediaCard
