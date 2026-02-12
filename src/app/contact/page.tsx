import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ContactForm } from "@/components/sections/contact-form";

export const metadata = {
  title: "تواصل معنا | برنامج التمكين الريادي",
  description: "نستقبل استفساراتكم وملاحظاتكم بكل اهتمام. تواصل معنا الآن.",
};

export default function ContactPage() {
  return (
    <main className="min-h-dvh flex flex-col bg-[#4B3D90]">
      <Header />

      <div className="flex-1 flex flex-col pt-20">
        <ContactForm />
      </div>

      <Footer />
    </main>
  );
}
