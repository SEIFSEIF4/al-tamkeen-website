"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#4B3D90]"
    >
      {/* Abstract Geometric Graphic - Left Side */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute left-0 top-0 bottom-0 w-full lg:w-1/2 flex items-center justify-start pl-12 lg:pl-32"
        >
          <div className="relative w-full max-w-[500px] aspect-square">
            {/* LARGE ABSTRACT SHAPES */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute top-1/2 left-0 -translate-y-1/2 w-full"
            >
              {/* Main Cyan Shape */}

              <div className="relative">
                <div className="w-[240px] md:w-[360px] h-[300px] md:h-[450px] relative">
                  {/* Glow effect behind SVG */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[200px] md:w-[300px] h-[200px] md:h-[300px] rounded-full bg-[#7AD5E7]/30 blur-[80px]" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[140px] md:w-[200px] h-[140px] md:h-[200px] rounded-full bg-[#42A2E4]/25 blur-[60px]" />
                  </div>
                  {/* Inline SVG */}
                  <svg
                    className="w-full h-full relative z-10"
                    viewBox="0 0 316 397"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M212.021 313.085L19 396.423V297.16L152.335 243.217H73.3416V149.144H212.021V313.085Z"
                      fill="#7AD5E7"
                    />
                    <path
                      d="M316 149.145H212.017V46H316V149.145Z"
                      fill="#42A2E4"
                    />
                    <path
                      d="M193.021 267.085L0 350.423V251.16L133.335 197.217H54.3416V103.144H193.021V267.085Z"
                      fill="#7AD5E7"
                      fillOpacity="0.2"
                    />
                    <path
                      d="M297 103.145H193.017V3.05176e-05H297V103.145Z"
                      fill="#42A2E4"
                      fillOpacity="0.2"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-start">
          {/* Content - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full lg:w-1/2 text-right"
          >
            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-4xl md:text-5xl font-bold text-white leading-tight"
            >
              من الأثر إلى الاستدامة
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-lg md:text-xl mt-2 text-white/90 leading-relaxed max-w-xl ml-auto"
            >
              نحو جمعيات تُنشئ شركات، لا تكتفي بالمشاريع.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-3 bg-white rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
