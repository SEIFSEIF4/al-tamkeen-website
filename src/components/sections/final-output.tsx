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
    title: "تأسيس شركة ناشئة مملوكة للجمعية (كلياً أو جزئياً)",
  },
  {
    id: 2,
    title: "امتلاك نموذج عمل مجرّب وقابل للنمو",
  },
  {
    id: 3,
    title: "إعداد فريق قادر على إدارة الشركة بشكل مستقل",
  },
  {
    id: 4,
    title: "وضع خارطة طريق واضحة للتشغيل، التوسع، والاستدامة",
  },
];

export function FinalOutputSection() {
  return (
    <section
      id="outputs"
      className="bg-[#3E3082] relative overflow-hidden flex flex-col items-center justify-center min-h-[350px] md:min-h-[600px] py-12 md:py-0"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Optional subtle noise or gradient if needed, keeping it clean for now as per design */}
      </div>

      <div className="container mx-auto px-6 md:px-8 lg:px-16 relative z-10">
        {/* Section Title */}
        {/* <MotionWrapper className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            المخرج النهائي للبرنامج
          </h2>
        </MotionWrapper> */}

        {/* Output Cards Grid */}
        {/* <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
          staggerDelay={0.1}
        >
          {outputs.map((output) => (
            <StaggerItem key={output.id} className="h-full">
              <motion.div
                whileHover={{ y: -5 }}
                className="h-full bg-[#2D2466]/50 backdrop-blur-sm p-6 flex items-center justify-center text-center border border-white/10"
              >
                <h3 className="text-xl md:text-2xl font-bold text-white leading-relaxed">
                  {output.title}
                </h3>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer> */}

        {/* Final Output Bottom Section */}
        <MotionWrapper
          delay={0.4}
          className="relative max-w-4xl mx-auto text-center"
        >
          {/* The Quote Graphic - Simplified as a background shape or CSS */}
          {/** Abstract shape hint */}
          <div className="relative z-10">
            {/** Animated Badge */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "circOut" }}
              style={{ originX: 0.5 }} // Center expand
              className="inline-block bg-[#5D9FDD] text-white px-6 py-2 relative"
            >
              <span className="block font-bold text-xl md:text-4xl">
                المخرج النهائي
              </span>
            </motion.div>

            <h3 className="font-bold text-white mt-4 leading-tight">
              {/** Highlight Text Animation */}
              <motion.span
                initial={{ backgroundSize: "0% 100%" }}
                whileInView={{ backgroundSize: "100% 100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                style={{
                  backgroundImage: "linear-gradient(#5D9FDD, #5D9FDD)",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right center", // Start from right (RTL)
                }}
                className="text-2xl md:text-5xl px-2 leading-loose box-decoration-clone text-white pb-1"
              >
                ﴍﻛـــــــــــــﺔ ﻧﺎﺷــــــــــﺌﺔ اﺟﺘﻤـــــــــﺎﻋﻴﺔ،
              </motion.span>
              <br />
              <span className="text-white mt-4 text-lg md:text-4xl">
                مملوكة للجمعية، تدرُّ دخلاً وتُحدث أثراً
              </span>
            </h3>
          </div>
          {/* Large Quote Mark Graphic (Stylized) */}
          <div className="absolute right-0 md:-right-4 top-0 text-[#8FD2E3] opacity-20 text-[80px] md:text-[150px] font-serif leading-none select-none pointer-events-none">
            ”
          </div>
          <div className="absolute left-0 md:-left-4 -bottom-16 md:-bottom-34 text-[#8FD2E3] opacity-20 text-[80px] md:text-[150px] font-serif leading-none select-none pointer-events-none">
            “
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
