"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SizeGuideWithRelations } from "@/types/product-details";
import { X } from "lucide-react";
import Image from "next/image";

interface SizeGuideModalProps {
  guide: SizeGuideWithRelations;
  isOpen: boolean;
  onClose: () => void;
}

export function SizeGuideModal({ guide, isOpen, onClose }: SizeGuideModalProps) {
  const [activeVariant, setActiveVariant] = useState(guide.variants?.[0]?.id || "");
  const [activeGroup, setActiveGroup] = useState(guide.variants?.[0]?.groups?.[0]?.id || "");

  if (!isOpen) return null;

  const currentVariant = guide.variants?.find((v) => v.id === activeVariant);
  const currentGroup = currentVariant?.groups?.find((g) => g.id === activeGroup);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-2xl bg-[#f9f6f0] h-full shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#241b18]/10">
            <h2 className="font-serif text-2xl text-[#241b18] uppercase">
              {guide.displayTitle}
            </h2>
            <button onClick={onClose} className="p-2 text-[#241b18]/60 hover:text-[#241b18] transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-10">
            {/* How to measure */}
            {guide.howToMeasureImage && (
              <div className="space-y-4">
                <h3 className="font-sans text-sm tracking-widest text-[#241b18] uppercase">
                  How to Measure
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="relative aspect-square bg-white p-4">
                    <Image
                      src={guide.howToMeasureImage}
                      alt="How to measure guide"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="space-y-4">
                    {guide.measurementPoints?.map((pt) => (
                      <div key={pt.id}>
                        <h4 className="font-sans font-medium text-sm text-[#241b18]">
                          {pt.number}. {pt.label}
                        </h4>
                        <p className="text-xs text-[#241b18]/70 mt-1">{pt.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Matrix */}
            <div className="space-y-6">
              <h3 className="font-sans text-sm tracking-widest text-[#241b18] uppercase">
                Select Size Range
              </h3>
              
              {/* Variant Tabs */}
              {guide.variants && guide.variants.length > 1 && (
                <div className="flex gap-6 border-b border-[#241b18]/10">
                  {guide.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setActiveVariant(v.id);
                        setActiveGroup(v.groups?.[0]?.id || "");
                      }}
                      className={`pb-3 text-sm font-medium transition-colors ${
                        activeVariant === v.id
                          ? "text-[#c69255] border-b-2 border-[#c69255]"
                          : "text-[#241b18]/60 hover:text-[#241b18]"
                      }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              )}

              {/* Group Tabs */}
              {currentVariant?.groups && currentVariant.groups.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {currentVariant.groups.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setActiveGroup(g.id)}
                      className={`px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-full transition-colors ${
                        activeGroup === g.id
                          ? "bg-[#241b18] text-[#f9f6f0]"
                          : "border border-[#241b18]/20 text-[#241b18] hover:border-[#241b18]"
                      }`}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              )}

              {/* Table */}
              {currentGroup && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-[#241b18]/20">
                        <th scope="col" className="py-3 pr-4 font-medium text-[#241b18]/60 sticky left-0 bg-[#f9f6f0]">
                          Measurement
                        </th>
                        {currentGroup.columns.map((col, i) => (
                          <th key={i} scope="col" className="py-3 px-4 font-medium text-[#241b18] text-center">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#241b18]/10">
                      {(currentGroup.rows as Array<{ label: string; values: string[] }>).map((row, i) => (
                        <tr key={i} className="hover:bg-white/50 transition-colors">
                          <th scope="row" className="py-4 pr-4 font-medium text-[#241b18] sticky left-0 bg-[#f9f6f0]">
                            {row.label}
                          </th>
                          {row.values.map((val, j) => (
                            <td key={j} className="py-4 px-4 text-[#241b18]/80 text-center">
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
