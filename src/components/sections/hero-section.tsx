"use client";

import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#4B3D90]"
    >
      {/* Abstract Geometric Graphic */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute left-0 top-0 bottom-0 w-full lg:w-1/2 flex items-center justify-center lg:justify-start lg:pl-32"
        >
          <div className="relative w-[280px] h-[350px] sm:w-[350px] sm:h-[440px] md:w-[400px] md:h-[500px] lg:w-[500px] lg:h-[500px]">
            {/* LARGE ABSTRACT SHAPES */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute inset-0"
            >
              <motion.div
                className="relative w-full h-full group pointer-events-auto"
                whileHover="hover"
                initial="idle"
              >
                {/* Glow effect behind SVG - intensifies on hover */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  variants={{
                    idle: { scale: 1, opacity: 1 },
                    hover: { scale: 1.3, opacity: 1 },
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="w-[180px] sm:w-[220px] md:w-[300px] h-[180px] sm:h-[220px] md:h-[300px] rounded-full bg-[#7AD5E7]/30 blur-[80px]" />
                </motion.div>
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  variants={{
                    idle: { scale: 1, opacity: 1 },
                    hover: { scale: 1.4, opacity: 1 },
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="w-[120px] sm:w-[160px] md:w-[200px] h-[120px] sm:h-[160px] md:h-[200px] rounded-full bg-[#42A2E4]/25 blur-[60px]" />
                </motion.div>
                {/* Extra glow layer - only visible on hover */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  variants={{
                    idle: { scale: 0.8, opacity: 0 },
                    hover: { scale: 1.5, opacity: 1 },
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-[200px] sm:w-[260px] md:w-[350px] h-[200px] sm:h-[260px] md:h-[350px] rounded-full bg-[#7AD5E7]/20 blur-[100px]" />
                </motion.div>

                {/* Inline SVG with hover glow filter */}
                <motion.svg
                  className="w-full h-full relative z-10"
                  viewBox="0 0 316 397"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  variants={{
                    idle: { filter: "drop-shadow(0 0 0px transparent)" },
                    hover: {
                      filter:
                        "drop-shadow(0 0 20px rgba(122, 213, 231, 0.6)) drop-shadow(0 0 40px rgba(66, 162, 228, 0.3))",
                    },
                  }}
                  transition={{ duration: 0.4 }}
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
                </motion.svg>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-start min-h-screen lg:min-h-0">
          {/* Content - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full lg:w-1/2 text-right mt-auto mb-32 lg:my-0"
          >
            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-3xl md:text-4xl xl:text-5xl font-bold text-white leading-tight"
            >
              من الأثر إلى الاستدامة
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-base sm:text-lg md:text-2xl xl:text-3xl mt-2 text-white/90 leading-relaxed max-w-xl ml-auto"
            >
              نحو جمعيات تُنشئ شركات، لا تكتفي بالمشاريع.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
