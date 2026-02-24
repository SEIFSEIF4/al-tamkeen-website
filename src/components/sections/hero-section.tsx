"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <div className="w-full h-full" />,
});

export function HeroSection() {
  const [isMobile, setIsMobile] = useState(true); // default true to avoid flash of 3D on mobile

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[80vh] md:min-h-screen flex items-center overflow-hidden bg-[#4B3D90]"
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16 relative z-10 w-full">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between lg:min-h-0 w-full gap-4">
          {/* Content - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full lg:w-1/2 text-right lg:my-0"
          >
            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-xl sm:text-2xl md:text-4xl font-bold xl:text-5xl mt-4 md:mt-10 text-white leading-tight"
            >
              برنامج التمكين الريادي للجمعيات الأهلية
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-xs sm:text-sm md:text-2xl xl:text-3xl mt-2 text-white/90 leading-relaxed max-w-xl ml-auto"
            >
              نحو جمعيات أكثر وصولاً واستدامة وأعمق أثراً
            </motion.p>

            {/* Mobile CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-6 lg:hidden"
            >
              <Link
                href="/submit"
                className="inline-block bg-white text-[#4B3D90] px-8 py-3 rounded-xl font-bold text-base shadow-lg hover:bg-white/90 transition-all duration-300"
              >
                قدم الآن
              </Link>
            </motion.div>
          </motion.div>

          {/* 3D Graphic / Fallback - Left Side */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full lg:w-1/2 flex items-center justify-center relative"
          >
            <div className="relative w-full max-w-xs sm:max-w-md lg:max-w-2xl aspect-square">
              {isMobile ? (
                /* Mobile fallback — static image instead of heavy WebGL */
                <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                  <Image
                    src="/logo.svg"
                    alt="التمكين الريادي"
                    width={300}
                    height={300}
                    className="w-2/3 max-w-[200px] sm:max-w-[260px] h-auto opacity-90 drop-shadow-2xl"
                    priority
                  />
                </div>
              ) : (
                /* Desktop — full 3D Spline scene */
                <>
                  <style jsx global>{`
                    .spline-container canvas {
                      width: 100% !important;
                      height: 100% !important;
                      display: block;
                      border: none !important;
                      outline: none !important;
                      box-shadow: none !important;
                      background: transparent !important;
                    }
                    .spline-container > div,
                    .spline-container > div > canvas {
                      border: none !important;
                      outline: none !important;
                      box-shadow: none !important;
                    }
                  `}</style>
                  {/* LARGE SHAPES REPLACED BY SPLINE */}
                  <div className="absolute inset-0 w-full h-full pointer-events-none spline-container overflow-hidden border-0 outline-none">
                    <Spline
                      scene="https://prod.spline.design/OOzvU5u5cDxzEMbC/scene.splinecode"
                      onLoad={(spline: any) => {
                        spline.setBackgroundColor("#4B3D90");
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
