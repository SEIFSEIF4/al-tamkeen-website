"use client";

import { motion } from "framer-motion";
import {
  StaggerContainer,
  StaggerItem,
  MotionWrapper,
} from "@/components/ui/motion-wrapper";

const outputs = [
  {
    id: 1,
    title: "المخرج الأول",
    description:
      "نص تجريبي للوصف سيتم استبداله لاحقاً بنص حقيقي يعبر عن المخرج الأول.",
    icon: (
      <svg
        className="w-12 h-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
  },
  {
    id: 2,
    title: "المخرج الثاني",
    description:
      "نص تجريبي للوصف سيتم استبداله لاحقاً بنص حقيقي يعبر عن المخرج الثاني.",
    icon: (
      <svg
        className="w-12 h-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    id: 3,
    title: "المخرج الثالث",
    description:
      "نص تجريبي للوصف سيتم استبداله لاحقاً بنص حقيقي يعبر عن المخرج الثالث.",
    icon: (
      <svg
        className="w-12 h-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    id: 4,
    title: "المخرج الرابع",
    description:
      "نص تجريبي للوصف سيتم استبداله لاحقاً بنص حقيقي يعبر عن المخرج الرابع.",
    icon: (
      <svg
        className="w-12 h-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

export function FinalOutputSection() {
  return (
    <section
      id="outputs"
      className="section-padding bg-[#4B3D90] relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.05 }}
          viewport={{ once: true }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-16 relative z-10">
        {/* Section Title */}
        <MotionWrapper className="text-right mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
            المخرج الأخير
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold text-[#8FD2E3]">
            للبرنامج
          </h3>
        </MotionWrapper>

        {/* Output Cards Grid */}
        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          staggerDelay={0.1}
        >
          {outputs.map((output) => (
            <StaggerItem key={output.id}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="h-full"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 h-full border border-white/20 hover:bg-white/20 transition-all group">
                  {/* Icon */}
                  <div className="w-20 h-20 bg-white/10 rounded-xl flex items-center justify-center mb-6 text-[#8FD2E3] group-hover:bg-[#8FD2E3] group-hover:text-white transition-all">
                    {output.icon}
                  </div>

                  {/* Title */}
                  <h4 className="text-xl font-bold text-white mb-3">
                    {output.title}
                  </h4>

                  {/* Description */}
                  <p className="text-white/70 leading-relaxed">
                    {output.description}
                  </p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Decorative Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 h-1 bg-gradient-to-l from-[#8FD2E3] via-white/30 to-transparent rounded-full origin-right"
        />
      </div>
    </section>
  );
}
