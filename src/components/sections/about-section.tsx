"use client";

import { motion } from "framer-motion";
import { MotionWrapper } from "@/components/ui/motion-wrapper";

export function AboutSection() {
  return (
    <section id="about" className="relative py-16 bg-white overflow-hidden">
      {/* Decorative Cyan Triangle - Top Left */}
      <div
        className="absolute top-0 left-0 w-[40%] h-[160px] bg-[#5BC5C4]/25"
        style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
      />

      <div className="container mx-auto px-4 md:px-8 lg:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-20">
          {/* Logo - Right Side */}
          <div className="lg:w-2/5 flex justify-center lg:justify-end">
            <MotionWrapper direction="left" delay={0.4}>
              <div className="relative">
                {/* Fallback stylized logo if logo.svg is not found */}
                <img
                  src="/logo.svg"
                  alt="التمكين الريادي"
                  className="w-full max-w-[300px] lg:max-w-[380px] h-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const fallback =
                      e.currentTarget.parentElement?.querySelector(
                        ".fallback-mission-logo",
                      );
                    if (fallback)
                      (fallback as HTMLElement).style.display = "flex";
                  }}
                />

                <div className="fallback-mission-logo hidden flex-col items-center gap-4">
                  <div className="w-32 h-32 bg-[#5BC5C4] rounded-xl flex items-center justify-center shadow-lg">
                    <div className="w-16 h-16 border-4 border-white rounded-lg" />
                  </div>
                  <div className="text-right">
                    <h2 className="text-3xl font-bold text-[#5A4B9A]">
                      التمكين الريادي
                    </h2>
                    <p className="text-xl text-[#5BC5C4] font-medium text-center">
                      للجمعيات الأهلية
                    </p>
                  </div>
                </div>
              </div>
            </MotionWrapper>
          </div>

          {/* Mission Text - Left Side */}
          <div className="lg:w-3/5 text-right lg:text-right pt-16 lg:pt-0">
            <MotionWrapper direction="right" delay={0.2}>
              <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-[#5A4B9A] leading-relaxed text-right">
                برنامج التمكين الريادي للجمعيات الأهلية هو أول برنامج وطني
                يُمكّن الجمعيات من تحويل رسالتها الاجتماعية إلى شركات ناشئة
                مستدامة، تُدار بعقلية ريادية وتُحدث أثرًا طويل المدى.
              </p>
            </MotionWrapper>
          </div>
        </div>
      </div>
    </section>
  );
}
