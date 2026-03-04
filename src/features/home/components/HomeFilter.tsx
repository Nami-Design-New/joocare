"use client ";

import { InputField } from "@/shared/components/InputField";
import { Button } from "@/shared/components/ui/button";

export default function HomeFilter() {
  return (
    <form className="flex items-center justify-center rounded-full gap-1 w-full p-2 bg-border">
      <InputField
        className="bg-white grow-[1.5]"
        containerStyles="w-auto grow-[1.5]"
      />
      <InputField className="bg-white" containerStyles="w-auto  grow" />
      <InputField className="bg-white" containerStyles="w-auto  grow" />
      <InputField className="bg-white" containerStyles="w-auto  grow" />
      <Button variant="default" size="pill" className="shrink-0">
        Find Jobs
      </Button>
    </form>
  );
}
