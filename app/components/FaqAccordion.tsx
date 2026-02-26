"use client";

import { useState } from "react";

type FAQItem = { q: string; a: string };

export default function FaqAccordion({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const isOpen = open === idx;
        return (
          <div key={item.q} className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? null : idx)}
              className="w-full flex items-center justify-between px-5 py-4"
            >
              <span className="text-sm md:text-base font-black">{item.q}</span>
              <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
            <div className={`px-5 ${isOpen ? "pb-5" : "h-0 hidden"}`}>
              <p className="text-sm text-gray-600">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
