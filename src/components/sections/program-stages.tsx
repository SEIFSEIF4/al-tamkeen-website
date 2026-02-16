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
    title: "التطوير البرمجي للشركة",
    description: "تصميم الواجهات والبرمجة والتهيئة للإطلاق",
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
    <section id="stages" className="py-24 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#4B3D90] rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#8FD2E3] rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-16 relative z-10">
        <MotionWrapper className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1E3A5F] mb-6">
            مراحل البرنامج
          </h2>
        </MotionWrapper>

        <div className="relative max-w-5xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute right-[23px] md:right-1/2 md:translate-x-1/2 top-0 bottom-0 w-0.5 bg-gray-100">
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="w-full bg-linear-to-b from-[#8FD2E3] via-[#4B3D90] to-[#A8C442]"
            />
          </div>

          <div className="space-y-12 md:space-y-0">
            {stages.map((stage, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={stage.number}
                  className="relative flex items-center md:h-48 group"
                >
                  {/* Content Container */}
                  <div
                    className={`flex flex-col md:flex-row w-full items-center ${isEven ? "md:flex-row-reverse" : ""}`}
                  >
                    {/* Circle Indicator */}
                    <div className="absolute right-0 md:right-1/2 md:translate-x-1/2 z-20">
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                          delay: 0.1,
                        }}
                        className="w-12 h-12 rounded-full bg-white border-4 border-[#4B3D90] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                      >
                        <span className="text-lg font-bold text-[#1E3A5F]">
                          {stage.number}
                        </span>
                      </motion.div>
                    </div>

                    {/* Card */}
                    <div
                      className={`w-full md:w-[45%] pr-14 md:pr-0 ${isEven ? "md:pl-12" : "md:pr-12 md:text-left"}`}
                    >
                      <motion.div
                        initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="bg-white p-6 rounded-2xl shadow-xl shadow-gray-100/50 border border-gray-100 hover:border-[#8FD2E3] transition-colors duration-300"
                        dir="rtl"
                      >
                        <h3 className="text-xl md:text-2xl font-bold text-[#1E3A5F] mb-3">
                          {stage.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                          {stage.description}
                        </p>
                      </motion.div>
                    </div>

                    {/* Spacer for desktop */}
                    <div className="hidden md:block w-[45%]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
