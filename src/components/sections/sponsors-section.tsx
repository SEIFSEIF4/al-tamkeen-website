"use client";

import Image from "next/image";
import { MotionWrapper } from "@/components/ui/motion-wrapper";

export function SponsorsSection() {
  return (
    <section className="py-4 md:py-6 bg-[#5D9FDD] text-center">
      <div className="container mx-auto px-6 md:px-8 lg:px-16 relative z-10">
        <MotionWrapper
          delay={0.1}
          className="flex flex-row flex-wrap justify-center items-center gap-3 md:gap-6"
        >
          {/* ryadah Card */}
          <div className="bg-white rounded-2xl p-3 sm:p-4 md:p-6 h-[110px] sm:h-[130px] md:h-[180px] w-[130px] sm:w-[160px] md:w-[220px] flex flex-col items-center justify-center shadow-lg">
            <a
              href="https://ryadh.com.sa/"
              target="_blank"
              rel="noopener noreferrer"
              title="زيارة موقع ريادة"
              className="flex flex-col items-center justify-center"
            >
              <span className="text-black text-xs sm:text-sm md:text-lg font-medium mb-1 md:mb-2 block">
                إحدى مبادرات
              </span>
              <div className="relative size-14 sm:size-16 md:size-24">
                <Image
                  src="/ryadah.svg"
                  alt="الريادة الاجتماعية"
                  fill
                  className="object-contain"
                />
              </div>
            </a>
          </div>
          {/* Partners Card */}
          <div className="bg-white  rounded-2xl p-3 sm:p-4 md:p-6 h-[110px] sm:h-[130px] md:h-[180px] flex flex-col items-center justify-center shadow-lg">
            <div className="relative h-[50px] sm:h-[60px] md:h-[90px] w-[200px] sm:w-[280px] md:w-[380px]">
              <Image
                src="/ahalina.png"
                alt="SNB Ahalina | مؤسسة الملك خالد"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
