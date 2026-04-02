import Image from "next/image";

export default function AboutSection() {
    return (
        <div className="rounded-2xl bg-white flex flex-col gap-4 p-4 border">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold ">About</h3>
            </div>
            <p className="text-muted-foreground text-sm text-justify">
                Saudi German Hospitals is the leading healthcare provider and the number one healthcare brand in the MENA region. Saudi German Hospital – Egypt is part of the renowned SGH Group, founded in 1988 by the El Batterji family. Today, the group operates 14 hospitals across 4 countries: Egypt, Saudi Arabia, the UAE,  and Yemen. As a tertiary care hospital, SGH–Egypt aspires to be a premier healthcare destination and an employer of choice, attracting top medical talent from across the region, the hospital is committed to establishing itself as one of Egypt’s leading tertiary care institutions SGH–Egypt will provide a comprehensive range of medical services, covering all specialties, sub-specialties, and critical care units, all delivered in line with the highest international healthcare standards.                    </p>

            <div className="flex gap-2 justify-between items-center">
                <div className="flex gap-2">
                    <Image
                        src="/assets/icons/linkedin-circle.svg"
                        width={30}
                        height={30}
                        alt="Linked in icon"
                    />
                    <Image
                        src="/assets/icons/facebook-circle.svg"
                        width={30}
                        height={30}
                        alt="Facebook icon"
                    />
                    <Image
                        src="/assets/icons/instagram-circle.svg"
                        width={30}
                        height={30}
                        alt="envelope icon"
                    />
                    <Image
                        src="/assets/icons/x-circle.svg"
                        width={30}
                        height={30}
                        alt="Linked in icon"
                    />
                    <Image
                        src="/assets/icons/snap-circle.svg"
                        width={30}
                        height={30}
                        alt="envelope icon"
                    />
                </div>
                <div className="text-primary bg-accent flex items-center gap-2 rounded-full px-4 py-2">
                    <Image
                        src="/assets/icons/pin-link-icon.svg"
                        alt="link icon"
                        width={24}
                        height={24}
                    />
                    <span className="text-lg">Share</span>
                </div>
            </div>
        </div>
    )
}
