import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ContactForm } from "@/components/sections/contact-form";

export const metadata = {
  title: "التمكين الريادي | نموذج التقديم ",
  description: "التمكين الريادي - نموذج التقديم",
};

export default function ContactPage() {
  return (
    <main className="min-h-dvh flex flex-col bg-[#4B3D90]">
      <Header sticky />

      <div className="flex-1 flex flex-col pt-20">
        <ContactForm />
      </div>

      <Footer />
    </main>
  );
}
