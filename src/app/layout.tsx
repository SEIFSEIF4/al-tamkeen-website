import type { Metadata } from "next";
import "./globals.css";
import { LenisProvider } from "@/components/providers/lenis-provider";

export const metadata: Metadata = {
  title: "التمكين الريادي للجمعيات الأهلية",
  description:
    "برنامج التمكين الريادي للجمعيات الأهلية هو أول برنامج وطني يُمكّن الجمعيات من تحويل رسالتها الاجتماعية إلى شركات ناشئة مستدامة",
  keywords: [
    "التمكين الريادي",
    "الجمعيات الأهلية",
    "ريادة الأعمال",
    "الشركات الناشئة",
    "الاستثمار الاجتماعي",
  ],
  authors: [{ name: "التمكين الريادي" }],
  openGraph: {
    title: "التمكين الريادي للجمعيات الأهلية",
    description:
      "برنامج التمكين الريادي للجمعيات الأهلية هو أول برنامج وطني يُمكّن الجمعيات من تحويل رسالتها الاجتماعية إلى شركات ناشئة مستدامة",
    type: "website",
    locale: "ar_SA",
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
