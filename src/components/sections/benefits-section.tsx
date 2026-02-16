"use client";

import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper";

const benefits = [
  {
    keyword: "تأهيل",
    text: "فريق الجمعية بالمعرفة والمهارات الريادية اللازمة لتأسيس وبناء الشركات الناشئة، بما يشمل فهم الفرص، ونماذج العمل، وآليات النمو والاستدامة.",
  },
  {
    keyword: "بناء",
    text: "الفكرة الريادية المنبثقة من خبرة الجمعية ومجال عملها، وتحويلها إلى فرصة حقيقية قابلة للتطبيق والنمو في السوق.",
  },
  {
    keyword: "تصميم",
    text: "نموذج عمل متكامل يحدد القيمة المقدمة، والعملاء المستهدفين، ومصادر الإيرادات، وآلية تحقيق الاستدامة المالية.",
  },
  {
    keyword: "تطوير",
    text: "الحل الرقمي وبرمجته وفق أفضل الممارسات التقنية، بما يضمن جاهزيته للاستخدام الفعلي من قبل المستفيدين.",
  },
  {
    keyword: "إطلاق",
    text: "المنتج أو الخدمة في السوق بشكل فعلي، وبدء رحلة التشغيل والوصول إلى المستفيدين.",
  },
];

export function BenefitsSection() {
  return (
    <section
      id="benefits"
      className="relative section-padding bg-[#4B3D90] overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-bl from-[#4B3D90] via-[#4B3D90] to-[#4A3D82]" />

        {/* Decorative shapes */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.1 }}
          viewport={{ once: true }}
          className="absolute top-0 left-0 w-96 h-96 bg-[#8FD2E3] rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"
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
          {/* Content - Right Side in RTL */}
          <div className="order-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                ماذا تكسب الجمعية
              </h2>
            </motion.div>

            <StaggerContainer className="space-y-6" staggerDelay={0.1}>
              {benefits.map((benefit, index) => (
                <StaggerItem key={index}>
                  <motion.div
                    whileHover={{ x: -5 }}
                    className="flex items-start gap-4 group"
                  >
                    {/* Arrow Icon - Chevron Style */}
                    <div className="relative">
                      <div className="w-10 h-10  relative">
                        <img
                          src="/element4.svg"
                          alt="Logo"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            const fallback =
                              e.currentTarget.parentElement?.querySelector(
                                ".fallback-logo",
                              );
                            if (fallback)
                              (fallback as HTMLElement).style.display = "flex";
                          }}
                        />
                      </div>
                    </div>

                    {/* Text */}
                    <p className="text-white text-lg lg:text-xl leading-relaxed">
                      <span className="font-bold text-[#8FD2E3] ml-1 block text-xl lg:text-2xl mb-1">
                        {benefit.keyword}
                      </span>
                      {benefit.text}
                    </p>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          {/* Image - Left Side in RTL */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 flex items-center justify-center"
          >
            <img
              src="/benefits-image.png"
              alt="الجمعية المشاركة"
              className="w-full max-w-[500px] h-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
