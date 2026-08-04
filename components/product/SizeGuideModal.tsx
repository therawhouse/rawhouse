"use client";

import React from "react";
import { X } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-raw-bg/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-raw-card border border-raw-border w-full max-w-2xl p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-raw-muted hover:text-raw-gold"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div className="text-center border-b border-raw-border pb-6">
            <h2 className="text-xl font-serif-luxury text-raw-ivory tracking-widest uppercase">
              Atelier Size Guide
            </h2>
            <p className="text-xs text-raw-muted mt-2 tracking-wider">
              Measurements are in inches. Garments are tailored for a true-to-size luxury fit.
            </p>
          </div>

          <div>
            <h3 className="text-sm text-raw-gold uppercase tracking-widest font-bold mb-4">Men's Topwear</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-raw-ivory border-collapse">
                <thead>
                  <tr className="bg-raw-bg border-b border-raw-border">
                    <th className="p-3">Size</th>
                    <th className="p-3">Chest</th>
                    <th className="p-3">Shoulder</th>
                    <th className="p-3">Sleeve</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-raw-border/50">
                  <tr className="hover:bg-raw-charcoal/30">
                    <td className="p-3 font-bold text-raw-gold">S (46)</td>
                    <td className="p-3">38"</td>
                    <td className="p-3">17.5"</td>
                    <td className="p-3">25"</td>
                  </tr>
                  <tr className="hover:bg-raw-charcoal/30">
                    <td className="p-3 font-bold text-raw-gold">M (48)</td>
                    <td className="p-3">40"</td>
                    <td className="p-3">18"</td>
                    <td className="p-3">25.5"</td>
                  </tr>
                  <tr className="hover:bg-raw-charcoal/30">
                    <td className="p-3 font-bold text-raw-gold">L (50)</td>
                    <td className="p-3">42"</td>
                    <td className="p-3">18.5"</td>
                    <td className="p-3">26"</td>
                  </tr>
                  <tr className="hover:bg-raw-charcoal/30">
                    <td className="p-3 font-bold text-raw-gold">XL (52)</td>
                    <td className="p-3">44"</td>
                    <td className="p-3">19"</td>
                    <td className="p-3">26.5"</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-sm text-raw-gold uppercase tracking-widest font-bold mb-4">Women's Topwear</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-raw-ivory border-collapse">
                <thead>
                  <tr className="bg-raw-bg border-b border-raw-border">
                    <th className="p-3">Size</th>
                    <th className="p-3">Bust</th>
                    <th className="p-3">Waist</th>
                    <th className="p-3">Hip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-raw-border/50">
                  <tr className="hover:bg-raw-charcoal/30">
                    <td className="p-3 font-bold text-raw-gold">XS (38)</td>
                    <td className="p-3">32"</td>
                    <td className="p-3">25"</td>
                    <td className="p-3">35"</td>
                  </tr>
                  <tr className="hover:bg-raw-charcoal/30">
                    <td className="p-3 font-bold text-raw-gold">S (40)</td>
                    <td className="p-3">34"</td>
                    <td className="p-3">27"</td>
                    <td className="p-3">37"</td>
                  </tr>
                  <tr className="hover:bg-raw-charcoal/30">
                    <td className="p-3 font-bold text-raw-gold">M (42)</td>
                    <td className="p-3">36"</td>
                    <td className="p-3">29"</td>
                    <td className="p-3">39"</td>
                  </tr>
                  <tr className="hover:bg-raw-charcoal/30">
                    <td className="p-3 font-bold text-raw-gold">L (44)</td>
                    <td className="p-3">38"</td>
                    <td className="p-3">31"</td>
                    <td className="p-3">41"</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
