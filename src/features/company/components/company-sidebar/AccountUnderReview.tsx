import { Badge } from "@/shared/components/ui/badge"
import Image from "next/image"

const AccountUnderReview = () => {
    return (
        <section className="bg-background border rounded-2xl flex flex-col gap-3 py-3 px-4">
            <div className="flex gap-2 w-full items-center ">
                <Image
                    src="/profile-placeholder.svg"
                    alt="Profile"
                    width={60}
                    height={60}
                    className="rounded-full"
                />
                <div>
                    <p className="text-black font-semibold text-md">Saudi German Hospital Egypt</p>
                    <p className="text-md font-normal mt-1">
                        Hospital
                    </p>
                </div>
            </div>
                <p className="text-sm text-muted-foreground">
                    Saudi German Hospitals is the leading healthcare provider and the number one healthcare brand in the MENA reg
                </p>

                <Badge className="bg-warning-bg text-warning justify-start text-base  py-1 px-4 mt-2 w-full font-normal">
                    Account under review.

                </Badge>
        </section>
    )
}

export default AccountUnderReview
