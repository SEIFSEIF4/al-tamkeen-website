"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CountdownTimer } from "@/components/ui/countdown-timer";

// Target date: April 7, 2026 at midnight (Arabia Standard Time, UTC+3)
const TARGET_DATE = new Date("2026-04-07T00:00:00+03:00");

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <div className="w-full h-full" />,
});

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-[85vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-[#4B3D90]"
    >
      <style jsx global>{`
        .spline-hero,
        .spline-hero *,
        .spline-hero *::before,
        .spline-hero *::after {
          border: 0 !important;
          border-style: none !important;
          outline: 0 !important;
          box-shadow: none !important;
          -webkit-box-shadow: none !important;
          -webkit-appearance: none !important;
          filter: none !important;
          background: transparent !important;
        }
        .spline-hero canvas {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
        }
      `}</style>

      {/* Centered Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 py-16 md:py-0 gap-6 md:gap-8 max-w-3xl mx-auto">
        {/* 3D Scene / Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px] relative"
        >
          {/* Logo fallback — always visible behind */}
          <Image
            src="/logo.svg"
            alt="التمكين الريادي"
            width={300}
            height={300}
            className="w-full h-full object-contain absolute inset-0 z-0"
            priority
          />
          {/* 3D Spline — renders on top */}
          <div className="absolute inset-0 w-full h-full z-10 pointer-events-none spline-hero overflow-hidden rounded-none border-0 outline-none">
            <Spline
              scene="https://prod.spline.design/OOzvU5u5cDxzEMbC/scene.splinecode"
              onLoad={(spline: any) => {
                spline.setBackgroundColor("#4B3D90");
              }}
            />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-2xl sm:text-3xl md:text-5xl xl:text-6xl font-bold text-white leading-tight"
        >
          مشروع التمكين الريادي للجمعيات الأهلية
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="text-sm sm:text-base md:text-2xl xl:text-3xl text-white/85 leading-relaxed max-w-2xl"
        >
          نحو جمعيات أكثر وصولاً واستدامة وأعمق أثراً
        </motion.p>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <CountdownTimer targetDate={TARGET_DATE} />
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="mt-2"
        >
          <Link
            href="/submit"
            className="inline-block bg-white text-[#4B3D90] px-10 py-3.5 rounded-2xl font-bold text-base md:text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            قدم الآن
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
