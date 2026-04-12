"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import Image from "next/image";

const BG_IMAGES = [
  { src: "/HEROPIC1.jpg", alt: "Hero Background 1" },
  { src: "/HEROPIC2.jpg", alt: "Hero Background 2" },
  { src: "/HEROPIC3.jpg", alt: "Hero Background 3" },
];

export function GlobalBackgroundSlider() {
  const [index, setIndex] = useState(0);
  const { scrollYProgress } = useScroll();

  // Change background index based on scroll depth
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.4) {
      if (index !== 0) setIndex(0);
    } else if (latest < 0.7) {
      if (index !== 1) setIndex(1);
    } else {
      if (index !== 2) setIndex(2);
    }
  });

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.35, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{ willChange: "transform, opacity" }}
        >
          <Image
            src={BG_IMAGES[index].src}
            alt={BG_IMAGES[index].alt}
            fill
            priority
            quality={85}
            className="object-cover object-center grayscale-[20%] contrast-[1.1]"
          />
        </motion.div>
      </AnimatePresence>

      {/* Subtle overlay to keep text legible */}
      <div className="absolute inset-0 bg-white/25 backdrop-blur-[1px]" aria-hidden />

      {/* Radial depth mask */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_0%,white_100%)] opacity-50" />
    </div>
  );
}
