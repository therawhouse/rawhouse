"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";

/**
 * ============================================================================
 * THE RAW HOUSE - Gucci-Inspired Full-Bleed Editorial Hero Carousel
 * ============================================================================
 */

const SLIDES = [
  {
    id: 1,
    title: "STORIES. REIMAGINED.",
    subtitle: "EVERY COLLECTION BEGINS WITH A STORY",
    ctaText: "EXPLORE COLLECTIONS",
    ctaLink: "/catalog",
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1800",
  },
  {
    id: 2,
    title: "EXPLORE. REINTERPRET. CONNECT.",
    subtitle: "MODERN, WEARABLE DESIGN",
    ctaText: "DISCOVER THE VISION",
    ctaLink: "/about",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1800",
  },
  {
    id: 3,
    title: "CONTEMPORARY AESTHETICS",
    subtitle: "TIMELESS, MEANINGFUL, & GLOBALLY RELEVANT",
    ctaText: "SHOP NEW ARRIVALS",
    ctaLink: "/catalog",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1800",
  },
];

export const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <section className="relative w-full h-[85vh] min-h-[600px] bg-raw-bg overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority
            className="object-cover object-center"
          />
          {/* Gucci Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-raw-bg via-raw-bg/40 to-raw-bg/20" />
        </motion.div>
      </AnimatePresence>

      {/* Hero Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-6 flex flex-col justify-end pb-20 items-center text-center">
        <motion.span
          key={`sub-${slide.id}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xs md:text-sm font-medium tracking-[0.35em] text-raw-gold uppercase mb-3"
        >
          {slide.subtitle}
        </motion.span>

        <motion.h1
          key={`title-${slide.id}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-3xl md:text-6xl font-serif-luxury text-raw-ivory tracking-[0.15em] max-w-4xl leading-tight mb-8"
        >
          {slide.title}
        </motion.h1>

        <motion.div
          key={`cta-${slide.id}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <Link
            href={slide.ctaLink}
            className="bg-raw-gold text-raw-bg font-semibold text-xs uppercase tracking-[0.25em] px-8 py-4 hover:bg-raw-goldHover transition-all transform hover:-translate-y-0.5 shadow-lg"
          >
            {slide.ctaText}
          </Link>
          <Link
            href="/catalog"
            className="border border-raw-ivory text-raw-ivory hover:border-raw-gold hover:text-raw-gold font-medium text-xs uppercase tracking-[0.25em] px-8 py-4 transition-all"
          >
            EXPLORE ALL COLLECTIONS
          </Link>
        </motion.div>
      </div>

      {/* Slide Controls */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1))}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 text-raw-ivory hover:text-raw-gold p-3 glass-card rounded-full transition-colors"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 text-raw-ivory hover:text-raw-gold p-3 glass-card rounded-full transition-colors"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-1.5 transition-all duration-500 ${
              idx === currentSlide ? "w-8 bg-raw-gold" : "w-2 bg-raw-muted/50"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
