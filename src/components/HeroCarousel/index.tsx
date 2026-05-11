import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { carouselSlides } from "@/data/carouselData";
import { cn } from "@/lib/utils";

const AUTO_SLIDE_MS = 3000;

export const HeroCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [autoplayCycle, setAutoplayCycle] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const slideCount = useMemo(() => carouselSlides.length, []);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrentIndex(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, onSelect]);

  useEffect(() => {
    if (!api || isPaused) return;

    const timer = window.setInterval(() => {
      api.scrollNext();
    }, AUTO_SLIDE_MS);

    return () => window.clearInterval(timer);
  }, [api, isPaused, autoplayCycle]);

  const handlePrev = useCallback(() => {
    api?.scrollPrev();
    setAutoplayCycle((prev) => prev + 1);
  }, [api]);

  const handleNext = useCallback(() => {
    api?.scrollNext();
    setAutoplayCycle((prev) => prev + 1);
  }, [api]);

  const handleDotClick = useCallback(
    (index: number) => {
      api?.scrollTo(index);
      setAutoplayCycle((prev) => prev + 1);
    },
    [api]
  );

  return (
    <section
      className="relative w-full px-4 py-10 md:px-6 md:py-14"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      aria-label="Education Expo 2026 banner carousel"
    >
      <Carousel
        opts={{ loop: true, align: "start" }}
        setApi={setApi}
        className="group relative mx-auto w-full max-w-[1160px] rounded-[20px] overflow-hidden bg-white/85 shadow-[0_20px_60px_rgba(0,0,0,0.15)] backdrop-blur-md transition-all duration-400 ease-in-out hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-[0_28px_70px_rgba(0,0,0,0.18)]"
      >
        <CarouselContent className="-ml-0">
          {carouselSlides.map((slide, index) => {
            const isActive = index === currentIndex;

            return (
              <CarouselItem key={slide.id} className="pl-0">
                <div className="grid min-h-[560px] w-full grid-cols-1 items-stretch md:min-h-[520px] md:grid-cols-[0.95fr_0.77fr]">
                  <div className="relative min-h-[250px] overflow-hidden rounded-t-[20px] md:min-h-full md:rounded-t-none md:rounded-l-[20px]">
                    <img
                      src={failedImages[slide.id] ? "/expo.png" : slide.image}
                      alt={slide.title}
                      loading="lazy"
                      onError={() =>
                        setFailedImages((prev) => ({
                          ...prev,
                          [slide.id]: true,
                        }))
                      }
                      className="block h-auto w-full object-contain md:absolute md:inset-0 md:h-full md:w-full md:object-contain md:object-left"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 bg-gradient-to-l from-white/55 via-white/25 to-transparent md:block" />
                  </div>

                  <div className="flex items-center px-6 py-8 md:px-12 md:py-10 lg:px-14">
                    <div className="max-w-lg text-left text-slate-800 md:mx-auto">
                      <h2
                        className={cn(
                          "text-2xl font-bold leading-tight md:text-3xl lg:text-4xl",
                          "opacity-100"
                        )}
                      >
                        {slide.title}
                      </h2>

                      <p
                        className={cn(
                          "mt-3 text-sm font-medium text-slate-700/90 md:mt-4 md:text-base",
                          "transition-all duration-500 ease-out",
                          isActive ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                        )}
                      >
                        {slide.subtitle}
                      </p>

                      <ul
                        className={cn(
                          "mt-5 space-y-2.5 text-sm md:mt-6 md:text-[15px]",
                          "transition-all delay-75 duration-500 ease-out",
                          isActive ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                        )}
                      >
                        {slide.highlights.map((point) => (
                          <li key={point} className="flex items-start gap-2.5 text-slate-700">
                            <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 flex-none text-slate-600" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>

                      {(slide.eventDate || slide.eventLocation) && (
                        <div
                          className={cn(
                            "mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-700 md:mt-6",
                            "transition-all delay-100 duration-500 ease-out",
                            isActive ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                          )}
                        >
                          {slide.eventDate && (
                            <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-3 py-1.5">
                              <CalendarDays className="h-4 w-4" />
                              {slide.eventDate}
                            </span>
                          )}
                          {slide.eventLocation && (
                            <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-3 py-1.5">
                              <MapPin className="h-4 w-4" />
                              {slide.eventLocation}
                            </span>
                          )}
                        </div>
                      )}

                      <div
                        className={cn(
                          "mt-7 transition-all delay-150 duration-500 ease-out md:mt-8",
                          isActive ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                        )}
                      >
                        <Button
                          asChild
                          size="lg"
                          className="rounded-full bg-slate-900 px-8 py-6 text-base font-semibold text-white shadow-md transition-all duration-300 ease-out hover:scale-105 hover:bg-slate-800"
                        >
                          <Link to={slide.ctaRoute}>{slide.ctaLabel}</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <button
          type="button"
          onClick={handlePrev}
          className="absolute bottom-14 left-3 z-20 hidden rounded-full border border-slate-300 bg-white/90 p-2.5 text-slate-700 backdrop-blur-sm transition-colors hover:bg-white md:flex md:bottom-auto md:left-4 md:top-1/2 md:-translate-y-1/2"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="absolute bottom-14 right-3 z-20 hidden rounded-full border border-slate-300 bg-white/90 p-2.5 text-slate-700 backdrop-blur-sm transition-colors hover:bg-white md:flex md:bottom-auto md:right-4 md:top-1/2 md:-translate-y-1/2"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 md:bottom-4">
          {Array.from({ length: slideCount }).map((_, index) => (
            <button
              key={`dot-${index}`}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => handleDotClick(index)}
              className={cn(
                "h-2.5 rounded-full transition-all duration-300",
                currentIndex === index ? "w-8 bg-slate-800" : "w-2.5 bg-slate-400/70 hover:bg-slate-500"
              )}
            />
          ))}
        </div>
      </Carousel>
    </section>
  );
};
