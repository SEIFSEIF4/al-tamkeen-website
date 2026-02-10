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

export function ProgramStages() {
  return (
    <section
      id="stages"
      className="section-padding bg-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#5A4B9A] rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#5BC5C4] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-16 relative z-10">
        {/* Section Title */}
        <MotionWrapper className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1E3A5F] mb-4">
            مراحل البرنامج
          </h2>
          <div className="w-24 h-1 bg-gradient-to-l from-[#5A4B9A] to-[#5BC5C4] mx-auto rounded-full" />
        </MotionWrapper>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute right-1/2 translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#5BC5C4] via-[#5A4B9A] to-[#5BC5C4] hidden md:block" />

          <StaggerContainer
            className="space-y-12 md:space-y-0"
            staggerDelay={0.15}
          >
            {stages.map((stage, index) => (
              <StaggerItem key={stage.number}>
                <div
                  className={`relative flex items-start md:items-center gap-6 md:gap-0 ${
                    stage.position === "right"
                      ? "md:flex-row"
                      : "md:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div
                    className={`flex-1 ${
                      stage.position === "right"
                        ? "md:text-left md:pr-12"
                        : "md:text-right md:pl-12"
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-white p-6 rounded-2xl shadow-lg shadow-gray-100/50 border border-gray-100 hover:shadow-xl transition-shadow"
                    >
                      <h3 className="text-xl md:text-2xl font-bold text-[#1E3A5F] mb-2">
                        {stage.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {stage.description}
                      </p>
                    </motion.div>
                  </div>

                  {/* Number Circle */}
                  <div className="relative z-10 flex-shrink-0">
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
                      className="w-14 h-14 md:w-16 md:h-16 bg-white border-4 border-[#5BC5C4] rounded-full flex items-center justify-center shadow-lg"
                    >
                      <span className="text-xl md:text-2xl font-bold text-[#5A4B9A]">
                        {stage.number}
                      </span>
                    </motion.div>

                    {/* Decorative Arrow */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                      className={`absolute ${
                        stage.position === "right"
                          ? "right-full mr-4"
                          : "left-full ml-4"
                      } top-1/2 -translate-y-1/2 hidden md:block`}
                    >
                      <div
                        className="w-8 h-8 bg-[#5BC5C4]"
                        style={{
                          clipPath:
                            stage.position === "right"
                              ? "polygon(0 0, 100% 50%, 0 100%)"
                              : "polygon(100% 0, 0 50%, 100% 100%)",
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* Empty space for the other side */}
                  <div className="hidden md:block flex-1" />
                </div>

                {/* Connection line for mobile */}
                {index < stages.length - 1 && (
                  <div className="w-1 h-8 bg-gradient-to-b from-[#5BC5C4] to-[#5A4B9A] mr-7 md:hidden" />
                )}
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
