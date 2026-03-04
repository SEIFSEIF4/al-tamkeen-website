"use client";

import Image from "next/image";
import { MotionWrapper } from "@/components/ui/motion-wrapper";

export function SponsorsSection() {
  return (
    <section className="py-4 md:py-6 bg-[#5D9FDD] text-center">
      <div className="container mx-auto px-1 md:px-8 lg:px-16 relative z-10">
        <MotionWrapper
          delay={0.1}
          className="flex flex-row flex-wrap justify-center items-center gap-3 md:gap-6"
        >
          <div className="bg-white order-3 rounded-2xl p-3 sm:p-4 md:p-6 h-[110px] sm:h-[130px] md:h-[180px] w-[130px] sm:w-[160px] md:w-[220px] flex flex-col items-center justify-center shadow-lg">
            <div className="relative w-24 h-16 md:w-36 md:h-24">
              <Image src="/SNB.svg" alt="SNB" fill className="object-contain" />
            </div>
          </div>
          <div className="bg-white order-3 rounded-2xl p-3 sm:p-4 md:p-6 h-[110px] sm:h-[130px] md:h-[180px] w-[130px] sm:w-[160px] md:w-[220px] flex flex-col items-center justify-center shadow-lg">
            <div className="relative w-24 h-16 md:w-36 md:h-24">
              <Image
                src="/ahalinaa.svg"
                alt="Ahalina"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div className="bg-white order-3 rounded-2xl p-3 sm:p-4 md:p-6 h-[110px] sm:h-[130px] md:h-[180px] w-[130px] sm:w-[160px] md:w-[220px] flex flex-col items-center justify-center shadow-lg">
            <div className="relative w-24 h-16 md:w-36 md:h-24">
              <Image
                src="/khaled.svg"
                alt="King Khalid Foundation"
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
