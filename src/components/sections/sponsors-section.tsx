"use client";

import Image from "next/image";
import { MotionWrapper } from "@/components/ui/motion-wrapper";

export function SponsorsSection() {
  return (
    <section className="py-16 bg-[#5D9FDD] text-center">
      <div className="container mx-auto px-4">
        <MotionWrapper className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
          {/* Partner Card */}
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm aspect-4/3 flex flex-col items-center justify-center shadow-lg">
            <span className="text-black text-2xl font-medium mb-4 block">
              بالشراكة مع
            </span>
            <div className="relative size-48">
              <Image
                src="/kingKhaildFoundation.jpg"
                alt="King Khalid Foundation"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Sponsor Card */}
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm aspect-4/3 flex flex-col items-center justify-center shadow-lg">
            <span className="text-black text-2xl font-medium mb-4 block">
              برعاية
            </span>
            <div className="relative size-48">
              <Image
                src="/SNB.png"
                alt="Saudi National Bank"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </MotionWrapper>

        <MotionWrapper delay={0.2}>
          <p className="text-white/90 text-lg md:text-2xl font-medium">
            يُقدّم البرنامج بالشراكة مع مؤسسة الملك خالد وبرعاية البنك الأهلي.
          </p>
        </MotionWrapper>
      </div>
    </section>
  );
}
