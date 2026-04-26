import { Star } from "lucide-react";
import SectionTitle from "./SectionTitle";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/components/ui/carousel";
import type { HomeRate } from "../types/home.types";

export const TestimonialCard = ({
  name,
  date,
  text,
  rate,
}: {
  id?: string | number | undefined;
  rate?: string | number | null | undefined;
  comment?: string | null | undefined;
  created_at?: string | null | undefined;
  name?: string | null | undefined;
  date?: string | null | undefined;
  text?: string | null | undefined;
}) => (
  <div className="bg-card flex flex-col  gap-3 rounded-tl-4xl rounded-br-4xl p-6 h-full w-full">
    <div className="flex justify-between">
      <div>
        <h5 className="text-secondary text-xl font-normal">{name}</h5>
        <p className="text-muted-foreground text-xs">{date}</p>
      </div>
      <div className="mb-4 flex gap-1">
        {[...Array(5)].map((_, i) => {
          const isFilled = i < Math.round(Number(rate) || 0);

          return (
            <Star
              key={i}
              className={`h-4 w-4 ${isFilled ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
          );
        })}
      </div>
    </div>
    <p className="text-muted-foreground leading-tight">{text}</p>
  </div>
);

export const Testimonials = ({
  title,
  reviews,
}: {
  title: string;
  reviews: HomeRate[];
}) => {
  // console.log("review ::", reviews);

  return (
    <section className="bg-background py-10 md:py-20">
      <div className="layout-shell">
        <div className="layout-content">

          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
          >
            {/* Header */}
            <div className="mb-12 flex items-center justify-between">
              <div className="space-y-4">
                <SectionTitle sectionTitle="What Professionals Say" />
                <h2>{title}</h2>
              </div>

              {/* Shadcn carousel controls wired to the same Carousel context */}
              <div className="flex gap-4">
                <CarouselPrevious className="border-border text-secondary hover:bg-secondary static h-12 w-12 translate-y-0 rounded-full border transition-all hover:text-white" />
                <CarouselNext className="border-border text-secondary hover:bg-secondary static h-12 w-12 translate-y-0 rounded-full border transition-all hover:text-white" />
              </div>
            </div>

            {/* Cards */}
            <CarouselContent className="-ml-6 items-stretch">
              {reviews.map((rev) => (
                <CarouselItem key={rev.id} className="pl-6 md:basis-1/3 flex">
                  <TestimonialCard {...rev} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};
