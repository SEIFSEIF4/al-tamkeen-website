import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/providers/lenis-provider";

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://y-mu-lac.vercel.app"),
  title: "التمكين الريادي للجمعيات الأهلية",
  description:
    "أول برنامج وطني يُمكّن الجمعيات الأهلية من تحويل رسالتها الاجتماعية إلى شركات ناشئة مستدامة عبر التدريب والاستثمار والدعم التقني.",
  keywords: [
    "التمكين الريادي",
    "الجمعيات الأهلية",
    "ريادة الأعمال",
    "الشركات الناشئة",
    "الاستثمار الاجتماعي",
    "ريادة اجتماعية",
    "القطاع غير الربحي",
    "تمكين الجمعيات",
    "برنامج وطني",
  ],
  authors: [{ name: "التمكين الريادي" }],
  creator: "التمكين الريادي",
  publisher: "التمكين الريادي",
  alternates: {
    canonical: "https://y-mu-lac.vercel.app",
  },
  openGraph: {
    title: "التمكين الريادي للجمعيات الأهلية",
    description:
      "أول برنامج وطني يُمكّن الجمعيات الأهلية من تحويل رسالتها الاجتماعية إلى شركات ناشئة مستدامة عبر التدريب والاستثمار والدعم التقني.",
    url: "https://y-mu-lac.vercel.app",
    siteName: "التمكين الريادي للجمعيات الأهلية",
    type: "website",
    locale: "ar_SA",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "التمكين الريادي للجمعيات الأهلية",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "التمكين الريادي للجمعيات الأهلية",
    description:
      "أول برنامج وطني يُمكّن الجمعيات الأهلية من تحويل رسالتها الاجتماعية إلى شركات ناشئة مستدامة.",
    creator: "@Altamkeen",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "التمكين الريادي للجمعيات الأهلية",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  category: "ريادة أعمال",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`antialiased ${ibmPlexSansArabic.variable}`}>
        {/* <LenisProvider>{children}</LenisProvider> */}
        {children}
      </body>
    </html>
  );
}
