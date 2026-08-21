"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductDetailWithRelations, StoreDeliveryDefaults } from "@/types/product-details";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ProductInfoAccordionProps {
  details: ProductDetailWithRelations | null;
  delivery: StoreDeliveryDefaults;
  fallbackDescription: string;
}

export function ProductInfoAccordion({ details, delivery, fallbackDescription }: ProductInfoAccordionProps) {
  // Desktop default to open, mobile closed. We'll simplify to just default open for the first section here.
  const [openSection, setOpenSection] = useState<string | null>("description");

  const toggle = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const sections = [
    {
      id: "description",
      label: "DESCRIPTION & FIT",
      content: (
        <div className="space-y-4">
          {details?.badge && (
            <span className="inline-block px-2 py-1 text-xs uppercase tracking-wider border border-[#c69255] text-[#c69255]">
              {details.badge}
            </span>
          )}
          <div
            className="prose prose-sm max-w-none text-[#241b18]"
            dangerouslySetInnerHTML={{ __html: details?.descriptionHtml || `<p>${fallbackDescription}</p>` }}
          />
          {(details?.fitType || details?.length || details?.neckline) && (
            <ul className="list-disc pl-5 text-sm text-[#241b18]/80 mt-4">
              {details.fitType && <li>Fit: {details.fitType}</li>}
              {details.length && <li>Length: {details.length}</li>}
              {details.neckline && <li>Neckline: {details.neckline}</li>}
            </ul>
          )}
        </div>
      ),
      hasContent: true, // Always show description as there's a fallback
    },
    {
      id: "material",
      label: "MATERIAL & CARE",
      content: (
        <div className="space-y-4 text-sm text-[#241b18]/80">
          {details?.composition && (
            <p><strong>Composition:</strong> {details.composition}</p>
          )}
          {details?.careInstructions && details.careInstructions.length > 0 && (
            <div>
              <strong>Care:</strong>
              <ul className="list-disc pl-5 mt-2">
                {details.careInstructions.map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ),
      hasContent: !!(details?.composition || (details?.careInstructions && details.careInstructions.length > 0)),
    },
    {
      id: "delivery",
      label: "DELIVERY AND PAYMENT",
      content: (
        <div className="space-y-4 text-sm text-[#241b18]/80">
          <p><strong>Delivery Time:</strong> {delivery.deliveryTime}</p>
          <div dangerouslySetInnerHTML={{ __html: delivery.deliveryNoteHtml }} />
          
          <div className="mt-4 pt-4 border-t border-[#f9f6f0]">
            <p><strong>Returns:</strong> {delivery.returnsEligible ? "Eligible" : "Not Eligible"}</p>
            <div dangerouslySetInnerHTML={{ __html: delivery.returnsNoteHtml }} />
          </div>
        </div>
      ),
      hasContent: true, // Always has global defaults
    }
  ];

  return (
    <div className="w-full border-t border-[#241b18]/10 mt-8">
      {sections.filter(s => s.hasContent).map((section) => {
        const isOpen = openSection === section.id;
        return (
          <div key={section.id} className="border-b border-[#241b18]/10">
            <button
              onClick={() => toggle(section.id)}
              className="w-full py-4 flex items-center justify-between focus:outline-none"
              aria-expanded={isOpen}
              aria-controls={`content-${section.id}`}
            >
              <h3 className="font-sans text-sm tracking-widest text-[#241b18] uppercase">
                {section.label}
              </h3>
              <span className="text-[#c69255] transition-transform duration-200">
                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </span>
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  id={`content-${section.id}`}
                  role="region"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 pt-2">
                    {section.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
