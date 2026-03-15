import CorePillarsContent from "./CorePillarsContent";
import CorePillarsVisual from "./CorePillarsVisual";

export default function CorePillarsSection() {
  return (
    <section className="bg-white py-16 sm:my-14 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:gap-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-0">
        <CorePillarsVisual />
        <CorePillarsContent />
      </div>
    </section>
  );
}
