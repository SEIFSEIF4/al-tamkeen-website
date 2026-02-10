"use client";

import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper";

const benefits = [
  {
    keyword: "تأهيل",
    text: "الفريق القيادي للجمعية على التفكير الريادي وبناء الشركات.",
  },
  {
    keyword: "تحويل",
    text: "فكرة أو منتج اجتماعي إلى شركة ناشئة ذات نموذج عمل واضح.",
  },
  {
    keyword: "بناء",
    text: "الفريق القيادي للجمعية على التفكير الريادي وبناء الشركات.",
  },
  {
    keyword: "تطوير",
    text: "الحوكمة والفصل المؤسسي بين الجمعية والشركة.",
  },
  {
    keyword: "إعداد",
    text: "الشركة للتوسع، والشراكات، والاستثمار مستقبلاً.",
  },
  {
    keyword: "مرافقة",
    text: "متخصصة من خبراء في ريادة الأعمال والاستثمار الاجتماعي.",
  },
];

export function BenefitsSection() {
  return (
    <section
      id="benefits"
      className="relative section-padding bg-[#5A4B9A] overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-bl from-[#5A4B9A] via-[#5A4B9A] to-[#4A3D82]" />

        {/* Decorative shapes */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.1 }}
          viewport={{ once: true }}
          className="absolute top-0 left-0 w-96 h-96 bg-[#5BC5C4] rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.1 }}
          viewport={{ once: true }}
          className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full translate-x-1/4 translate-y-1/4 blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-[#4A3D82]">
              <img
                src="/benefits-image.png"
                alt="الجمعية المشاركة"
                className="w-full aspect-[4/3] object-cover relative z-10"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback =
                    e.currentTarget.parentElement?.querySelector(
                      ".fallback-image",
                    );
                  if (fallback)
                    (fallback as HTMLElement).style.display = "flex";
                }}
              />

              {/* Placeholder for building image */}
              <div className="fallback-image hidden aspect-[4/3] bg-gradient-to-br from-[#4A3D82] to-[#1E3A5F] items-center justify-center">
                <div className="text-center">
                  <svg
                    className="w-24 h-24 text-[#5BC5C4] mx-auto mb-4"
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
                  <p className="text-white/60 text-sm">صورة المبنى</p>
                </div>
              </div>

              {/* Decorative corner accent */}
              <div
                className="absolute top-0 left-0 w-20 h-20 bg-[#5BC5C4] z-20"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 0 100%)",
                }}
              />
            </div>
          </motion.div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                ماذا تكتسب
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-[#5BC5C4]">
                الجمعية المشاركة في البرنامج؟
              </h3>
            </motion.div>

            <StaggerContainer className="space-y-5" staggerDelay={0.1}>
              {benefits.map((benefit, index) => (
                <StaggerItem key={index}>
                  <motion.div
                    whileHover={{ x: -5 }}
                    className="flex items-start gap-4 group"
                  >
                    {/* Arrow Icon */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="flex-shrink-0 w-8 h-8 bg-[#5BC5C4] flex items-center justify-center"
                      style={{
                        clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                      }}
                    />

                    {/* Text */}
                    <p className="text-white text-lg leading-relaxed">
                      <span className="font-bold text-[#5BC5C4] ml-1">
                        {benefit.keyword}
                      </span>
                      {benefit.text}
                    </p>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
