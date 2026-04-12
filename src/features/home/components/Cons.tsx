import { Search } from "lucide-react";
import React from "react";
import SectionTitle from "./SectionTitle";
import type { HomeWhyModel } from "../types/home.types";

export default function Cons({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: HomeWhyModel[];
}) {
  return (
    <div className="">
      <SectionTitle sectionTitle="The Legacy Model" translationKey="legacyModel" />
      <h3 className="text-secondary mt-2 text-xl font-semibold">{title}</h3>
      <p className="text-4 text-muted-foreground mt-6 mb-10">{description}</p>
      <ul className="flex flex-col items-start gap-8">
        {items.map((item) => (
          <li key={item.id} className="flex gap-7">
            <div className="bg-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
              <Search className="text-white" />
            </div>
            <div>
              <h4 className="mb-2 text-xl font-semibold">{item.title}</h4>
              <p className="text-muted-foreground font-normal">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
