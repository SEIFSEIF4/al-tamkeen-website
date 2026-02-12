"use client";

import { motion } from "framer-motion";
import { MotionWrapper } from "@/components/ui/motion-wrapper";

const criteria = [
  "أن تكون جمعية أهلية مسجلة رسميًا داخل المملكة",
  "أن تمتلك رسالة اجتماعية واضحة وقابلة للتحويل إلى نموذج ريادي",
  "التزام مجلس الإدارة أو القيادة التنفيذية بالمشاركة في البرنامج",
  "وجود فريق قابل للتفرغ الجزئي خلال مدة البرنامج",
  "الرغبة الجادة في تأسيس شركة ناشئة وليس مجرد تطوير مشروع",
];

export function AcceptanceCriteriaSection() {
  return (
    <section id="criteria" className="section-padding bg-white overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
          {/* Text Content */}
          <div className="w-full lg:w-1/2">
            <MotionWrapper>
              <h2 className="text-3xl md:text-5xl font-bold text-[#4B3D90] mb-8 leading-tight">
                معايير القبول
                <br />
                في البرنامج للجمعيات
              </h2>
            </MotionWrapper>

            <div className="flex flex-col gap-4">
              {criteria.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex items-start gap-3"
                >
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#4B3D90] shrink-0" />
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
                    {item}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Decorative visual or empty space to balance if needed, 
               but for now keeping it clean as per the image reference which was text-heavy.
               We can add an illustration here later if requested.
           */}
          <div className="hidden lg:block w-full lg:w-5/12 relative h-[400px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative w-full h-full"
            >
              {/* Main abstract shape */}
              <div className="absolute top-10 left-10 w-64 h-64 bg-[#4B3D90]/5 rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#5D9FDD]/10 rounded-full blur-3xl" />

              {/* Decorative Elements */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-1/4 left-10 z-10"
              >
                <div className="w-20 h-20 border-4 border-[#4B3D90]/20 rounded-2xl rotate-12" />
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute bottom-1/3 right-10 z-10"
              >
                <div className="w-16 h-16 bg-[#5D9FDD] rounded-full opacity-20" />
              </motion.div>

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <svg
                  width="300"
                  height="300"
                  viewBox="0 0 300 300"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="opacity-10"
                >
                  <circle
                    cx="150"
                    cy="150"
                    r="148"
                    stroke="#4B3D90"
                    strokeWidth="2"
                    strokeDasharray="10 10"
                  />
                  <circle
                    cx="150"
                    cy="150"
                    r="100"
                    stroke="#5D9FDD"
                    strokeWidth="2"
                  />
                </svg>
              </motion.div>

              {/* Floating Icon or Checkmark composition */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white p-6 rounded-2xl shadow-xl border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-[#4B3D90]/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-[#4B3D90]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="w-24 h-4 bg-gray-100 rounded-full" />
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-[#5D9FDD]/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-[#5D9FDD]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="w-32 h-4 bg-gray-100 rounded-full" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#8FD2E3]/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-[#8FD2E3]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div className="w-20 h-4 bg-gray-100 rounded-full" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
