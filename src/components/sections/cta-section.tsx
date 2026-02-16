"use client";

import Link from "next/link";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 bg-[#5D9FDD] text-center border-white/20">
      <div className="container mx-auto px-4">
        <MotionWrapper>
          <Button
            asChild
            size="lg"
            className="bg-[#3E3082] hover:bg-[#32266a] text-white text-3xl px-12 py-8 font-bold rounded-xl transition-all duration-300 mb-8"
          >
            <Link href="/contact">قــدّم الآن</Link>
          </Button>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            وابدأ رحلة التحوّل الريادي لجمعيتك
          </h2>
        </MotionWrapper>
      </div>
    </section>
  );
}
