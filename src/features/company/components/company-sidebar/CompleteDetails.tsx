import { Link } from "@/i18n/navigation"
import { buttonVariants } from "@/shared/components/ui/button"

const CompleteDetails = () => {
    return (
        <section className="bg-[#DC26260D]  rounded-2xl flex flex-col gap-3 py-3 px-4">

            <h3 className="text-destructive text-xl font-semibold">Please complete your details.</h3>

            <p className="text-base text-muted-foreground">
                Please complete your account details so you can use the platform normally and benefit from all its features.
            </p>

            <Link href={'/company/complete-account'} className={` ${buttonVariants({
                size: "pill",
                variant: "destructive"
            })} 
           text-[16px]`}>Complete Now </Link>
        </section>
    )
}

export default CompleteDetails
