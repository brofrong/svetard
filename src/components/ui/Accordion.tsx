"use client";

import { Plus } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { type ReactNode, useId, useState } from "react";
import { cx } from "@/lib/cx";

export type AccordionItem = {
  id: string;
  title: string;
  meta?: string;
  content: ReactNode;
};

type AccordionProps = { items: AccordionItem[]; defaultOpenId?: string };

export function Accordion({ items, defaultOpenId }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);
  const baseId = useId();
  return (
    <MotionConfig reducedMotion="user">
      <ul className="border-t border-taupe/40">
        {items.map((item) => {
          const isOpen = openId === item.id;
          const buttonId = `${baseId}-${item.id}-button`;
          const panelId = `${baseId}-${item.id}-panel`;
          return (
            <li key={item.id} className="border-b border-taupe/40">
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="flex w-full items-center gap-6 py-6 text-left lg:py-8"
                >
                  {item.meta ? (
                    <span className="font-serif text-2xl text-gold-3 lg:text-3xl">
                      {item.meta}
                    </span>
                  ) : null}
                  <span className="flex-1 font-serif text-2xl font-light text-espresso lg:text-3xl">
                    {item.title}
                  </span>
                  <Plus
                    aria-hidden="true"
                    strokeWidth={1.25}
                    className={cx(
                      "size-5 shrink-0 text-gold-3 transition-transform duration-500 ease-silk",
                      isOpen && "rotate-45",
                    )}
                  />
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.section
                    key="panel"
                    id={panelId}
                    aria-labelledby={buttonId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-8 leading-relaxed text-mocha lg:pl-16">
                      {item.content}
                    </div>
                  </motion.section>
                ) : null}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </MotionConfig>
  );
}
