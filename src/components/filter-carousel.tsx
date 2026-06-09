"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

interface FilterCarouselProps {
  value?: string | null;
  isLoading?: boolean;
  onSelect: (value: string | null) => void;
  data: {
    value: string;
    label: string;
  }[];
}

export const FilterCarousel = ({
  value,
  onSelect,
  data,
  isLoading,
}: FilterCarouselProps) => {
  console.log(value);

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="relative w-full">
      {/* 左侧渐隐效果 */}
      <div
        className={cn(
          "absolute left-12 top-0 bottom-0 w-12 z-10 bg-linear-to-r from-white to-transparent pointer-events-none",
          current == 1 && "hidden",
        )}
      />

      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          dragFree: true,
        }}
        className="w-full px-12"
      >
        <CarouselContent className="-ml-3">
          {!isLoading && (
            <CarouselItem
              onClick={() => onSelect(null)}
              className="pl-3 basis-auto"
            >
              <Badge
                variant={!value ? "default" : "secondary"}
                className="rounded-md px-3 py-3 cursor-pointer whitespace-nowrap text-sm"
              >
                全部
              </Badge>
            </CarouselItem>
          )}

          {!isLoading &&
            data.map((item) => (
              <CarouselItem
                onClick={() => onSelect(item.value)}
                key={item.value}
                className="pl-3 basis-auto"
              >
                {
                  <Badge
                    variant={value == item.value ? "default" : "secondary"}
                    className="rounded-md px-3 py-3 cursor-pointer whitespace-nowrap text-sm"
                  >
                    {item.label}
                  </Badge>
                }
              </CarouselItem>
            ))}
          {isLoading &&
            Array.from({ length: 14 }).map((item, index) => (
              <CarouselItem key={index} className="pl-3 basis-auto">
                <Skeleton className="rounded-md w-[75px] h-[27px] cursor-pointer whitespace-nowrap text-sm"></Skeleton>
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 z-20" />
        <CarouselNext className="right-0 z-20" />
      </Carousel>

      {/* 右侧渐隐效果 */}
      <div
        className={cn(
          "absolute right-12 top-0 bottom-0 w-12 z-10 bg-linear-to-l from-white to-transparent pointer-events-none",
          current === count && "hidden",
        )}
      />
    </div>
  );
};
