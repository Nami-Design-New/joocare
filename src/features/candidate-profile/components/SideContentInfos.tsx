"use client";

import { Progress } from "@/shared/components/ui/progress";
import { CircleAlert, Sparkles } from "lucide-react";
import Image from "next/image";
import UploadCvSection from "./UploadCvSection";

const SideContentInfos = () => {
  return (
    <aside className="no-scrollbar flex flex-col gap-5 overflow-y-auto rounded-2xl bg-white px-3 py-6 shadow lg:h-dvh">
      {/* image */}
      <section className="mx-auto flex w-50 flex-col items-center justify-center gap-2">
        <Image
          src={"/assets/profile_image.svg"}
          alt="profile image"
          width={150}
          height={150}
          className="rounded-full"
        />
        <h2 className="mt-1 text-xl font-semibold text-black">
          Dr. Ahmed Al-Rashid
        </h2>
        <span className="text-primary text-sm font-semibold">
          Consultant Cardiologist
        </span>
      </section>

      {/* progress */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="text-primary h-4 w-4" />
            <span className="text-sm font-semibold">Hiring Readines</span>
          </div>
          <span className="text-primary">85%</span>
        </div>
        <Progress value={60} />
        <div className="flex items-center gap-2">
          <CircleAlert className="text-primary h-4 w-4" />
          <span className="text-muted-foreground max-w-62 text-[12px]">
            Add your ACLS certificate to unlock premium job matches.
          </span>
        </div>
      </section>

      {/* progress */}
      <section className="my-2 flex flex-col lg:my-3 lg:gap-y-4">
        <div className="flex items-center justify-between p-2">
          <h6 className="text-muted-foreground text-sm font-semibold">
            {" "}
            Email{" "}
          </h6>
          <span className="text-sm font-semibold">saeed@gmail.com</span>
        </div>
        <div className="flex items-center justify-between p-2">
          <h6 className="text-muted-foreground text-sm font-semibold">
            {" "}
            Location{" "}
          </h6>
          <span className="text-sm font-semibold">Cairo, Egypt</span>
        </div>
        <div className="flex items-center justify-between p-2">
          <h6 className="text-muted-foreground text-sm font-semibold">Phone</h6>
          <span className="text-sm font-semibold">+201050345200</span>
        </div>
        <div className="flex items-center justify-between p-2">
          <h6 className="text-muted-foreground text-sm font-semibold">
            {" "}
            Experience{" "}
          </h6>
          <span className="text-sm font-semibold">+12 year</span>
        </div>
        <div className="flex items-center justify-between p-2">
          <h6 className="text-muted-foreground text-sm font-semibold">Age</h6>
          <span className="text-sm font-semibold">32</span>
        </div>
      </section>

      {/* upload cv */}
      <UploadCvSection />
    </aside>
  );
};

export default SideContentInfos;
