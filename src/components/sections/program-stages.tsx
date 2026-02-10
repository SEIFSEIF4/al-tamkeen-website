"use client";

import { motion } from "framer-motion";
import {
  MotionWrapper,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/motion-wrapper";

const stages = [
  {
    number: 1,
    title: "التأهيل الريادي",
    description:
      "بناء العقلية الريادية وفهم الفرق بين العمل الخيري والشركات الناشئة.",
    position: "right",
  },
  {
    number: 2,
    title: "بناء الفكرة الريادية",
    description:
      "تحويل الاحتياج الاجتماعي إلى فرصة استثمار اجتماعي قابلة للنمو.",
    position: "left",
  },
  {
    number: 3,
    title: "بناء نموذج العمل",
    description:
      "تصميم نموذج الاستدامة، التسعير، الشريحة المستهدفة، والقيمة المقترحة.",
    position: "right",
  },
  {
    number: 4,
    title: "تأسيس الشركة وتشغيلها",
    description: "الدعم القانوني، الهيكلي، والتشغيلي لإطلاق الشركة.",
    position: "left",
  },
  {
    number: 5,
    title: "الإطلاق والاستعداد للتوسع",
    description: "تجهيز الشركة للانطلاق، والشراكات، والاستدامة طويلة المدى.",
    position: "right",
  },
];

function DecoративLogo({ flip = false }: { flip?: boolean }) {
  return (
    <div
      className={`relative w-10 h-8 hidden md:block md:w-12 md:h-10 ${flip ? "scale-x-[-1]" : ""}`}
    >
      <div className="absolute top-0 right-0 w-4 h-4 md:w-5 md:h-5 bg-[#1E3A5F]" />
      <div className="absolute bottom-0 left-0 w-4 h-4 md:w-5 md:h-5 bg-[#8FD2E3]" />
      <div className="absolute top-2 right-2 md:top-[10px] md:right-[10px] w-4 h-4 md:w-5 md:h-5 bg-[#1E3A5F]" />
    </div>
  );
}

export function ProgramStages() {
  return (
    <section
      id="stages"
      className="section-padding bg-white relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#4B3D90] rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#8FD2E3] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-16 relative z-10">
        <MotionWrapper className="text-center mb-12 md:mb-24">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1E3A5F] mb-4">
            مراحل البرنامج
          </h2>
          <div className="w-24 h-1 bg-liner-to-l from-[#4B3D90] to-[#8FD2E3] mx-auto rounded-full" />
        </MotionWrapper>

        {/* Desktop Timeline */}
        <div className="relative max-w-4xl mx-auto hidden md:block">
          <div className="absolute right-1/2 translate-x-1/2 top-0 bottom-0 w-1 bg-liner-to-b from-[#8FD2E3] via-[#4B3D90] to-[#8FD2E3]" />

          <StaggerContainer className="space-y-0" staggerDelay={0.15}>
            {stages.map((stage, index) => (
              <StaggerItem key={stage.number}>
                <div
                  className={`relative flex items-center ${
                    stage.position === "right" ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  <div
                    className={`flex-1 ${
                      stage.position === "right"
                        ? "text-left pr-12"
                        : "text-right pl-12"
                    }`}
                  >
                    <motion.div whileHover={{ scale: 1.02 }} className="p-6">
                      <h3 className="text-2xl lg:text-3xl font-bold text-[#1E3A5F] mb-2">
                        {stage.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {stage.description}
                      </p>
                    </motion.div>
                  </div>

                  <div className="relative z-10 shrink-0 flex flex-col items-center gap-2">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      <DecoративLogo flip={stage.position === "left"} />
                    </motion.div>

                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: index * 0.1 + 0.2,
                      }}
                      className="w-16 h-16 bg-[#8FD2E3] rounded-lg flex items-center justify-center shadow-lg"
                    >
                      <span className="text-2xl font-bold text-white">
                        {stage.number}
                      </span>
                    </motion.div>
                  </div>

                  <div className="flex-1" />
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* Mobile Timeline */}
        <div className="md:hidden">
          <StaggerContainer className="space-y-6" staggerDelay={0.15}>
            {stages.map((stage, index) => (
              <StaggerItem key={stage.number}>
                <div className="flex items-start gap-3" dir="rtl">
                  {/* Right column: logo + number + line */}
                  <div className="flex flex-col items-center shrink-0">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      <DecoративLogo />
                    </motion.div>

                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: index * 0.1 + 0.2,
                      }}
                      className="w-12 h-12 bg-[#8FD2E3] rounded-lg flex items-center justify-center shadow-lg mt-1"
                    >
                      <span className="text-lg font-bold text-white">
                        {stage.number}
                      </span>
                    </motion.div>

                    {/* Connector line */}
                    {index < stages.length - 1 && (
                      <div className="w-0.5 flex-1 min-h-[24px] bg-liner-to-b from-[#8FD2E3] to-[#4B3D90] mt-2" />
                    )}
                  </div>

                  {/* Left column: text content */}
                  <div className="flex-1 md:pt-7 pb-2">
                    <h3 className="text-lg font-bold text-[#1E3A5F] mb-1">
                      {stage.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {stage.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
