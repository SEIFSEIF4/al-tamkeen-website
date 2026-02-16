"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MotionWrapper } from "@/components/ui/motion-wrapper";

const faqs = [
  {
    question: "هل يشترط وجود فكرة مسبقة؟",
    answer:
      "لا يشترط وجود فكرة جاهزة، فالبرنامج يساعد الجمعيات على اكتشاف وبناء الفكرة الريادية.",
  },
  {
    question: "هل يشترط وجود خبرة تقنية؟",
    answer: "لا، يوفر البرنامج الدعم التقني لتطوير المنتج.",
  },
  {
    question: "هل البرنامج مخصص لنوع معين من الجمعيات؟",
    answer: "البرنامج متاح لمختلف الجمعيات الأهلية في مختلف المجالات.",
  },
  {
    question: "هل يتطلب البرنامج التفرغ الكامل؟",
    answer:
      "يتطلب مشاركة الفريق في الأنشطة التدريبية والتطويرية وجميع محاور البرنامج وفق جدول البرنامج.",
  },
  {
    question: "هل ستؤسس الجمعية شركة فعلية؟",
    answer: "نعم، الهدف النهائي هو تأسيس شركة ناشئة مملوكة للجمعية.",
  },
  {
    question: "هل سيتم تطوير تطبيق أو منصة؟",
    answer:
      "نعم، إذا كانت الفكرة تتطلب منتجًا تقنيًا، سيتم تطويره ضمن البرنامج.",
  },
  {
    question: "هل البرنامج مدفوع؟",
    answer: "البرنامج مدعوم بالكامل، ولا يتطلب أي رسوم مالية للمشاركة.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="section-padding bg-liner-to-b from-gray-50 to-white overflow-hidden"
    >
      <div className="container mx-auto">
        <MotionWrapper className="text-right mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-[#4B3D90] mb-4">
            الأسئلة الشائعة
          </h2>
        </MotionWrapper>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl overflow-hidden transition-colors duration-300 ${
                openIndex === index ? "bg-gray-100" : "bg-gray-50"
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-right focus:outline-none"
              >
                <span className="text-lg md:text-xl font-bold text-navy-dark">
                  {faq.question}
                </span>
                <span className="shrink-0 mr-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                      openIndex === index
                        ? "bg-[#5D9FDD] text-white"
                        : "bg-[#5D9FDD] text-white"
                    }`}
                  >
                    {/* Animated Icon */}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 1V13M1 7H13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transition-transform duration-300 origin-center ${openIndex === index ? "rotate-45" : "rotate-0"}`}
                      />
                    </svg>
                  </div>
                </span>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed text-lg">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
