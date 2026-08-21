"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductDetailWithRelations, StoreDeliveryDefaults } from "@/types/product-details";
import { Plus, Minus } from "lucide-react";

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
            <span className="inline-block px-2 py-1 text-[11px] uppercase tracking-wider border border-raw-ivory text-raw-ivory mb-2">
              {details.badge}
            </span>
          )}
          <div
            className="prose prose-sm max-w-none text-raw-ivory/90 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: details?.descriptionHtml || `<p>${fallbackDescription}</p>` }}
          />
          {(details?.fitType || details?.length || details?.neckline) && (
            <ul className="space-y-1 text-sm text-raw-ivory/80 mt-4">
              {details.fitType && <li><span className="font-semibold text-raw-ivory">Fit:</span> {details.fitType}</li>}
              {details.length && <li><span className="font-semibold text-raw-ivory">Length:</span> {details.length}</li>}
              {details.neckline && <li><span className="font-semibold text-raw-ivory">Neckline:</span> {details.neckline}</li>}
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
        <div className="space-y-4 text-sm text-raw-ivory/80 leading-relaxed">
          {details?.composition && (
            <p><strong className="text-raw-ivory">Composition:</strong> {details.composition}</p>
          )}
          {details?.careInstructions && details.careInstructions.length > 0 && (
            <div>
              <strong className="text-raw-ivory block mb-1">Care instructions:</strong>
              <ul className="space-y-1">
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
        <div className="space-y-4 text-sm text-raw-ivory/80 leading-relaxed">
          <p><strong className="text-raw-ivory">Delivery Time:</strong> {delivery.deliveryTime}</p>
          <div dangerouslySetInnerHTML={{ __html: delivery.deliveryNoteHtml }} />
          
          <div className="mt-4 pt-4 border-t border-raw-ivory/10">
            <p><strong className="text-raw-ivory">Returns:</strong> {delivery.returnsEligible ? "Eligible" : "Not Eligible"}</p>
            <div dangerouslySetInnerHTML={{ __html: delivery.returnsNoteHtml }} />
          </div>
        </div>
      ),
      hasContent: true, // Always has global defaults
    }
  ];

  return (
    <div className="w-full mt-6">
      {sections.filter(s => s.hasContent).map((section) => {
        const isOpen = openSection === section.id;
        return (
          <div key={section.id} className="border-t border-raw-ivory/20 group">
            <button
              onClick={() => toggle(section.id)}
              className="w-full py-5 flex items-center justify-between focus:outline-none"
              aria-expanded={isOpen}
              aria-controls={`content-${section.id}`}
            >
              <h3 className="font-sans text-xs tracking-[0.1em] text-raw-ivory font-bold uppercase">
                {section.label}
              </h3>
              <span className="text-raw-ivory transition-transform duration-300">
                {isOpen ? <Minus size={16} strokeWidth={1.5} /> : <Plus size={16} strokeWidth={1.5} />}
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
