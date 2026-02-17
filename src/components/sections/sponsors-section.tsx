"use client";

import Image from "next/image";
import { MotionWrapper } from "@/components/ui/motion-wrapper";

export function SponsorsSection() {
  return (
    <section className="py-6 bg-[#5D9FDD] text-center">
      <div className="container mx-auto px-4">
        <MotionWrapper
          delay={0.1}
          className="flex flex-col md:flex-row justify-center items-center gap-6"
        >
          {/* ryadah Card */}
          <div className="bg-white aspect-square rounded-2xl p-2 w-full max-w-[200px] flex flex-col items-center justify-center shadow-lg">
            <a
              href="https://ryadh.com.sa/"
              target="_blank"
              rel="noopener noreferrer"
              title="زيارة موقع ريادة"
            >
              <span className="text-black text-lg font-medium mb-3 block">
                إحدى مبادرات
              </span>
              <div className="relative size-32">
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
          <div className="bg-white aspect-square rounded-2xl p-2 w-full max-w-[200px] flex flex-col items-center justify-center shadow-lg">
            <span className="text-black text-lg font-medium mb-3 block">
              بالشراكة مع
            </span>
            <div className="relative size-32">
              <Image
                src="/kingKhaildFoundation.jpg"
                alt="King Khalid Foundation"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Sponsor Card */}
          <div className="bg-white aspect-square rounded-2xl p-2 w-full max-w-[200px] flex flex-col items-center justify-center shadow-lg">
            <span className="text-black text-lg font-medium mb-3 block">
              برعاية
            </span>
            <div className="relative size-32">
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
