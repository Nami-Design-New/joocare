import CorePillarsContent from "./CorePillarsContent";
import CorePillarsVisual from "./CorePillarsVisual";
import type { AboutImage, AboutPillar } from "../types/about.types";

export default function CorePillarsSection({
  title,
  items,
  images,
}: {
  title: string;
  items: AboutPillar[];
  images: AboutImage[];
}) {
  return (
    <section className="bg-white py-16 sm:my-14 sm:py-20 lg:py-24">
      <div className="grid grid-cols-1 gap-10 px-4 sm:gap-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-0">
        <CorePillarsVisual images={images} />
        <CorePillarsContent title={title} items={items} />
      </div>
    </section>
  );
}
