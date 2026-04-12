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
  name: string;
  date: string;
  text: string;
  rate: number;
}) => (
  <div className="bg-card flex flex-col justify-between gap-3 rounded-tl-4xl rounded-br-4xl p-6 rtl:rounded-tl-none rtl:rounded-tr-4xl rtl:rounded-bl-4xl rtl:rounded-br-none">
    <div className="flex items-start justify-between gap-4">
      <div className="text-start">
        <h5 className="text-secondary text-xl font-normal">{name}</h5>
        <p className="text-muted-foreground text-xs">{date}</p>
      </div>
      <div className="mb-4 flex shrink-0 gap-1">
        {[...Array(5)].map((_, i) => {
          const isFilled = i < Math.round(rate || 0);

          return (
            <Star
              key={i}
              className={`h-4 w-4 ${isFilled ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
          );
        })}
      </div>
    </div>
    <p className="text-muted-foreground text-start leading-tight">{text}</p>
  </div>
);

export const Testimonials = ({
  title,
  reviews,
}: {
  title: string;
  reviews: HomeRate[];
}) => {
  return (
    <section className="bg-background py-10 md:py-20">
      <div className="container mx-auto px-3 lg:px-25">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
        >
          {/* Header */}
          <div className="mb-12 flex items-center justify-between gap-4">
            <div className="space-y-4 text-start">
              <SectionTitle sectionTitle="What Professionals Say" translationKey="whatProfessionalsSay" />
              <h2>{title}</h2>
            </div>

            {/* Shadcn carousel controls wired to the same Carousel context */}
            <div className="flex gap-4 rtl:flex-row-reverse">
              <CarouselPrevious className="border-border text-secondary hover:bg-secondary static h-12 w-12 translate-y-0 rounded-full border transition-all hover:text-white rtl-flip" />
              <CarouselNext className="border-border text-secondary hover:bg-secondary static h-12 w-12 translate-y-0 rounded-full border transition-all hover:text-white rtl-flip" />
            </div>
          </div>

          {/* Cards */}
          <CarouselContent className="-ml-6">
            {reviews.map((rev) => (
              <CarouselItem key={rev.id} className="pl-6 md:basis-1/3">
                <TestimonialCard {...rev} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};
