"use client"

import { Progress } from "@/shared/components/ui/progress";
import { CircleAlert, Sparkles } from "lucide-react";
import Image from "next/image";
import UploadCvSection from "./UploadCvSection";


const SideContentInfos = () => {
    return (
        <aside className="no-scrollbar flex  flex-col gap-5 overflow-y-auto bg-white px-3 py-6 rounded-2xl shadow min-h-[calc(100vh-250px)]">

            {/* image */}
            <section className="w-50 mx-auto flex flex-col justify-center items-center gap-2">
                <Image src={'/assets/profile_image.svg'} alt="profile image" width={150} height={150} className="rounded-full" />
                <h2 className="text-xl font-semibold text-black mt-1">
                    Dr. Ahmed Al-Rashid
                </h2>
                <span className="font-semibold text-sm text-primary">Consultant Cardiologist</span>
            </section>

            {/* progress */}
            <section className="flex flex-col gap-2">
                <div className="flex justify-between items-center ">
                    <div className="flex justify-center items-center gap-2 ">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold">Hiring Readines</span>
                    </div>
                    <span className="text-primary">85%</span>
                </div>
                <Progress value={60} />
                <div className="flex  items-center gap-2">
                    <CircleAlert className="w-4 h-4 text-primary" />
                    <span className="text-[12px] text-muted-foreground max-w-62">
                        Add your ACLS certificate to unlock premium job matches.
                    </span>
                </div>
            </section>

            {/* progress */}
            <section className="flex flex-col gap-4 my-3">
                <div className="flex justify-between items-center p-2">
                    <h6 className="text-sm font-semibold text-muted-foreground"> Email </h6>
                    <span className="text-sm font-semibold">saeed@gmail.com</span>
                </div>
                <div className="flex justify-between items-center p-2">
                    <h6 className="text-sm font-semibold text-muted-foreground"> Location </h6>
                    <span className="text-sm font-semibold">Cairo, Egypt</span>
                </div>
                <div className="flex justify-between items-center p-2">
                    <h6 className="text-sm font-semibold text-muted-foreground">Phone</h6>
                    <span className="text-sm font-semibold">+201050345200</span>
                </div>
                <div className="flex justify-between items-center p-2">
                    <h6 className="text-sm font-semibold text-muted-foreground"> Experience </h6>
                    <span className="text-sm font-semibold">+12 year</span>
                </div>
                <div className="flex justify-between items-center p-2">
                    <h6 className="text-sm font-semibold text-muted-foreground">Age</h6>
                    <span className="text-sm font-semibold">32</span>
                </div>
            </section>

            {/* upload cv */}
            <UploadCvSection />
        </aside>
    );
};

export default SideContentInfos;
