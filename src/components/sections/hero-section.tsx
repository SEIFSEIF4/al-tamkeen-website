"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
});

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#4B3D90]"
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16 relative z-10 w-full">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between lg:min-h-0 w-full">
          {/* Content - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full lg:w-1/2 text-right mt-auto mb-12 lg:my-0"
          >
            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-3xl md:text-4xl xl:text-5xl font-bold text-white leading-tight"
            >
              برنامج التمكين الريادي للجمعيات الأهلية
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-base sm:text-lg md:text-2xl xl:text-3xl mt-2 text-white/90 leading-relaxed max-w-xl ml-auto"
            >
              نحو جمعيات أكثر وصولاً واستدامة وأعمق أثراً
            </motion.p>
          </motion.div>

          {/* Spline 3D Graphic - Left Side */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full lg:w-1/2 flex items-center justify-center relative"
          >
            <div className="relative w-[20rem] aspect-square">
              <style jsx global>{`
                .spline-container canvas {
                  width: 100% !important;
                  height: 100% !important;
                  display: block;
                }
              `}</style>
              {/* LARGE SHAPES REPLACED BY SPLINE */}
              <div className="absolute inset-0 w-full h-full pointer-events-none spline-container">
                <Spline scene="https://prod.spline.design/OOzvU5u5cDxzEMbC/scene.splinecode" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
