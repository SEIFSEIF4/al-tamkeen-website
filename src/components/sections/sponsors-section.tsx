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
            <a
              href="https://ryadh.com.sa/"
              target="_blank"
              rel="noopener noreferrer"
              title="زيارة موقع ريادة"
              className="flex flex-col items-center justify-center"
            >
              <span className="text-black text-xs sm:text-sm md:text-lg font-medium mb-1 md:mb-2 block">
                أحد مشاريع
              </span>
              <div className="relative w-24 h-16 md:w-36 md:h-24">
                <Image
                  src="/ryadah.svg"
                  alt="الريادة الاجتماعية"
                  fill
                  className="object-contain"
                />
              </div>
            </a>
          </div>
          <div className="bg-white order-1 rounded-2xl p-3 sm:p-4 md:p-6 h-[110px] sm:h-[130px] md:h-[180px] flex items-center justify-center shadow-lg gap-3 sm:gap-4 md:gap-6">
            <div className="relative h-[50px] sm:h-[60px] md:h-[80px] w-[100px] sm:w-[130px] md:w-[170px] shrink-0">
              <Image
                src="/khaled.svg"
                alt="مؤسسة الملك خالد | King Khalid Foundation"
                fill
                className="object-contain"
              />
            </div>
            <div className="w-px h-[50px] sm:h-[60px] md:h-[80px] bg-gray-300 shrink-0" />
            <div className="relative p-4 h-[50px] sm:h-[60px] md:h-[80px] w-[100px] sm:w-[140px] md:w-[190px] shrink-0">
              <Image
                src="/ahalinaa.svg"
                alt="SNB Ahalina"
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
