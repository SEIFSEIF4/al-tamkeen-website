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
          <div className="bg-white rounded-2xl p-2 w-[110px] h-[110px] sm:w-[140px] sm:h-[140px] md:w-[200px] md:h-[200px] flex flex-col items-center justify-center shadow-lg">
            <a
              href="https://ryadh.com.sa/"
              target="_blank"
              rel="noopener noreferrer"
              title="زيارة موقع ريادة"
              className="flex flex-col items-center justify-center"
            >
              <span className="text-black text-xs sm:text-sm md:text-lg font-medium mb-1 md:mb-3 block">
                إحدى مبادرات
              </span>
              <div className="relative size-16 sm:size-20 md:size-32">
                <Image
                  src="/ryadah.svg"
                  alt="الريادة الاجتماعية"
                  fill
                  className="object-contain"
                />
              </div>
            </a>
          </div>
          {/* Partner Card */}
          <div className="bg-white rounded-2xl p-2 w-[110px] h-[110px] sm:w-[140px] sm:h-[140px] md:w-[200px] md:h-[200px] flex flex-col items-center justify-center shadow-lg">
            <span className="text-black text-xs sm:text-sm md:text-lg font-medium mb-1 md:mb-3 block">
              بالشراكة مع
            </span>
            <div className="relative size-16 sm:size-20 md:size-32">
              <Image
                src="/kingKhaildFoundation.jpg"
                alt="King Khalid Foundation"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Sponsor Card */}
          <div className="bg-white rounded-2xl p-2 w-[110px] h-[110px] sm:w-[140px] sm:h-[140px] md:w-[200px] md:h-[200px] flex flex-col items-center justify-center shadow-lg">
            <span className="text-black text-xs sm:text-sm md:text-lg font-medium mb-1 md:mb-3 block">
              برعاية
            </span>
            <div className="relative size-16 sm:size-20 md:size-32">
              <Image
                src="/SNB.png"
                alt="Saudi National Bank"
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
