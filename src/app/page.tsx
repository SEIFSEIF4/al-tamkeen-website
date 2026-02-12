import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { ProgramStages } from "@/components/sections/program-stages";
import { BenefitsSection } from "@/components/sections/benefits-section";
import { FinalOutputSection } from "@/components/sections/final-output";
import { AcceptanceCriteriaSection } from "@/components/sections/acceptance-criteria";
import { FAQSection } from "@/components/sections/faq-section";
import { SponsorsSection } from "@/components/sections/sponsors-section";
import { CTASection } from "@/components/sections/cta-section";
import { ContactForm } from "@/components/sections/contact-form";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <BenefitsSection />
      <ProgramStages />
      <FinalOutputSection />
      <AcceptanceCriteriaSection />
      <FAQSection />
      <SponsorsSection />
      <CTASection />
      {/* <div id="contact">
        <ContactForm />
      </div> */}
      <Footer />
    </main>
  );
}
