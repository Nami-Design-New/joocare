import { Star } from "lucide-react";
import SectionTitle from "./SectionTitle";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/components/ui/carousel";

const TestimonialCard = ({
  name,
  date,
  text,
}: {
  name: string;
  date: string;
  text: string;
}) => (
  <div className="bg-card flex flex-col justify-between gap-3 rounded-tl-4xl rounded-br-4xl p-6">
    <div className="flex justify-between">
      <div>
        <h5 className="text-secondary text-xl font-normal">{name}</h5>
        <p className="text-muted-foreground text-xs">{date}</p>
      </div>
      <div className="mb-4 flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
    </div>
    <p className="text-muted-foreground leading-tight">{text}</p>
  </div>
);

export const Testimonials = () => {
  const reviews = [
    {
      name: "Sarah Al-Qahtani",
      date: "10 January 2026",
      text: "I easily found the career I was looking for, with detailed information and clear pictures. An excellent experience!",
    },
    {
      name: "Badr Al-Anzi",
      date: "15 January 2026",
      text: "I didn't think finding a role would be this smooth. The platform was efficient and quick, and I got a good offer!",
    },
    {
      name: "Noura Al-Zahrani",
      date: "20 January 2026",
      text: "I loved the platform's design and ease of use. I faced no difficulties while applying, and the outcome was very satisfying!",
    },
    {
      name: "Nouras Al-Zahrani",
      date: "20 January 2026",
      text: "I loved the platform's design and ease of use. I faced no difficulties while applying, and the outcome was very satisfying!",
    },
    {
      name: "Nouraa Al-Zahrani",
      date: "20 January 2026",
      text: "I loved the platform's design and ease of use. I faced no difficulties while applying, and the outcome was very satisfying!",
    },
  ];

  return (
    <section className="bg-background py-10 md:py-20">
      <div className="container mx-auto px-3 lg:px-2">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
        >
          {/* Header */}
          <div className="mb-12 flex items-center justify-between">
            <div className="space-y-4">
              <SectionTitle sectionTitle="What Professionals Say" />
              <h2>
                Insights from healthcare professionals in <br /> real-world
                hiring contexts
              </h2>
            </div>

            {/* Shadcn carousel controls wired to the same Carousel context */}
            <div className="flex gap-4">
              <CarouselPrevious className="border-border text-secondary hover:bg-secondary static h-12 w-12 translate-y-0 rounded-full border transition-all hover:text-white" />
              <CarouselNext className="border-border text-secondary hover:bg-secondary static h-12 w-12 translate-y-0 rounded-full border transition-all hover:text-white" />
            </div>
          </div>

          {/* Cards */}
          <CarouselContent className="-ml-6">
            {reviews.map((rev, i) => (
              <CarouselItem key={i} className="pl-6 md:basis-1/3">
                <TestimonialCard {...rev} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};
