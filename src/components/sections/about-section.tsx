"use client";

import { motion } from "framer-motion";
import { MotionWrapper } from "@/components/ui/motion-wrapper";

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative pt-8 md:pt-28 pb-8 md:pb-24 bg-white overflow-hidden"
    >
      <div className="container mx-auto px-6 md:px-8 lg:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-20">
          {/* Logo - Right Side */}
          <div className="lg:w-2/5 flex justify-center lg:justify-end">
            <MotionWrapper direction="left" delay={0.4}>
              <div className="relative">
                <img
                  src="/logo-with-text.svg"
                  alt="التمكين الريادي"
                  className="w-full max-w-[220px] ml-4 md:ml-6 xl:ml-0 sm:max-w-[280px] lg:max-w-[380px] h-auto object-contain"
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
                  <div className="w-32 h-32 bg-[#8FD2E3] rounded-xl flex items-center justify-center shadow-lg">
                    <div className="w-16 h-16 border-4 border-white rounded-lg" />
                  </div>
                  <div className="text-right">
                    <h2 className="text-3xl font-bold text-[#4B3D90]">
                      التمكين الريادي
                    </h2>
                    <p className="text-xl text-[#8FD2E3] font-medium text-center">
                      للجمعيات الأهلية
                    </p>
                  </div>
                </div>
              </div>
            </MotionWrapper>
          </div>

          {/* Mission Text - Left Side */}
          <div className="lg:w-3/5 text-center lg:text-right pt-4 lg:pt-0">
            <MotionWrapper direction="right" delay={0.2}>
              <div className="text-right space-y-6">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-base md:text-lg font-medium text-gray-700 leading-relaxed">
                    <span className="text-[#8FD2E3] text-2xl mt-1">•</span>
                    <span>
                      مشروع متخصص يمكّن الجمعيات الأهلية من تأسيس شركات ناشئة
                      منبثقة من خبراتها ومجالات عملها، عبر منهجية عملية تجمع بين
                      التدريب، والإرشاد، والتطوير التقني، والإطلاق الفعلي.
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-base md:text-lg font-medium text-gray-700 leading-relaxed">
                    <span className="text-[#8FD2E3] text-2xl mt-1">•</span>
                    <span>
                      يركز المشروع على تحويل المعرفة والخبرة التي تمتلكها
                      الجمعية إلى منتجات أو خدمات مبتكرة قابلة للنمو والاستدامة،
                      مما يتيح للجمعية بناء مصادر دخل مستدامة وتعظيم أثرها
                      الاجتماعي.
                    </span>
                  </li>
                </ul>
              </div>
            </MotionWrapper>
          </div>
        </div>
      </div>
    </section>
  );
}
