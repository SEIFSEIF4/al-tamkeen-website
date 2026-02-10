import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { ProgramStages } from "@/components/sections/program-stages";
import { BenefitsSection } from "@/components/sections/benefits-section";
import { FinalOutputSection } from "@/components/sections/final-output";
import { ContactForm } from "@/components/sections/contact-form";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <ProgramStages />
      <BenefitsSection />
      <FinalOutputSection />
      <ContactForm />
      <Footer />
    </main>
  );
}
