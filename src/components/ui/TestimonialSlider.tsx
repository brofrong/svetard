"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import type { Testimonial } from "@/content/types";

type TestimonialSliderProps = {
  items: Testimonial[];
  prevLabel: string;
  nextLabel: string;
};

const arrowClass =
  "grid size-12 place-items-center rounded-full border border-gold-3 text-espresso transition-colors duration-500 hover:bg-espresso hover:text-ivory";

export function TestimonialSlider({
  items,
  prevLabel,
  nextLabel,
}: TestimonialSliderProps) {
  const listRef = useRef<HTMLUListElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const list = listRef.current;
    const card = list?.querySelector("li");
    if (!list || !card) return;
    list.scrollBy({
      left: direction * (card.getBoundingClientRect().width + 24),
      behavior: "smooth",
    });
  };

  return (
    <div>
      <ul
        ref={listRef}
        className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-6 overflow-x-auto px-6 pb-4 [scrollbar-width:none] lg:-mx-12 lg:scroll-px-12 lg:px-12"
      >
        {items.map((testimonial) => (
          <li
            key={testimonial.name}
            className="w-[min(85vw,28rem)] shrink-0 snap-start"
          >
            <figure className="flex h-full flex-col bg-ivory p-8 lg:p-10">
              <p className="eyebrow text-mocha">{testimonial.result}</p>
              <blockquote className="mt-6 flex-1 font-serif text-2xl leading-snug font-light text-espresso">
                «{testimonial.text}»
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <span className="relative size-14 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={testimonial.image.src}
                    alt={testimonial.image.alt}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </span>
                <span className="text-sm text-espresso">
                  {testimonial.name}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex gap-3">
        <button
          type="button"
          aria-label={prevLabel}
          onClick={() => scrollByCard(-1)}
          className={arrowClass}
        >
          <ArrowLeft aria-hidden="true" strokeWidth={1.25} className="size-4" />
        </button>
        <button
          type="button"
          aria-label={nextLabel}
          onClick={() => scrollByCard(1)}
          className={arrowClass}
        >
          <ArrowRight
            aria-hidden="true"
            strokeWidth={1.25}
            className="size-4"
          />
        </button>
      </div>
    </div>
  );
}
