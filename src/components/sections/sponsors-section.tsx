"use client";

import Image from "next/image";
import { MotionWrapper } from "@/components/ui/motion-wrapper";

export function SponsorsSection() {
  return (
    <section className="py-4 md:py-6 bg-[#5D9FDD] text-center">
      <div className="container mx-auto px-1 md:px-8 lg:px-16 relative z-10">
        <MotionWrapper
          delay={0.1}
          className="flex flex-row flex-nowrap justify-center items-center gap-2 md:gap-6"
        >
          <div className="bg-white rounded-2xl p-2 sm:p-4 md:p-6 h-[90px] sm:h-[130px] md:h-[180px] w-auto sm:w-auto md:w-auto flex flex-row items-center justify-center shadow-lg shrink-0 gap-2 sm:gap-4 md:gap-6">
            <div className="relative w-16 h-12 sm:w-24 sm:h-16 md:w-36 md:h-24">
              <Image
                src="/khaled.svg"
                alt="King Khalid Foundation"
                fill
                className="object-contain"
              />
            </div>
            <div className="w-px h-10 sm:h-16 md:h-20 bg-gray-300" />

            <div className="relative w-16 h-12 sm:w-24 sm:h-16 md:w-36 md:h-24">
              <Image src="/SNB.svg" alt="SNB" fill className="object-contain" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-2 sm:p-4 md:p-6 h-[90px] sm:h-[130px] md:h-[180px] w-[30%] sm:w-[160px] md:w-[220px] flex flex-col items-center justify-center shadow-lg shrink-0">
            <div className="relative w-16 h-12 sm:w-24 sm:h-16 md:w-36 md:h-24">
              <Image
                src="/ahalina_eng.svg"
                alt="Ahalina"
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
