import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google"; // Import the font
import "./globals.css";
import { LenisProvider } from "@/components/providers/lenis-provider";

// Configure the font
const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans-arabic",
  display: "swap",
});

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
      <body className={`antialiased ${ibmPlexSansArabic.variable}`}>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
