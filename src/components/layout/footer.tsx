"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#4B3D90] text-white" dir="rtl">
      {/* Main Footer */}
      <div className="container mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col-reverse lg:flex-row justify-between items-center lg:items-start gap-10">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <img
                src="/tamkeen_white.svg"
                alt="التمكين الريادي"
                className="h-24 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-x-16 gap-y-6 text-right">
            <div className="flex flex-col gap-3 text-white/90 font-medium">
              <Link
                href="/#hero"
                className="hover:text-[#8FD2E3] transition-colors"
              >
                الرئيسية
              </Link>
              <Link
                href="/#about"
                className="hover:text-[#8FD2E3] transition-colors"
              >
                فكرة المشروع
              </Link>
              <Link
                href="/#stages"
                className="hover:text-[#8FD2E3] transition-colors"
              >
                مراحل المشروع
              </Link>
            </div>
            <div className="flex flex-col gap-3 text-white/90 font-medium">
              <Link
                href="/#outputs"
                className="hover:text-[#8FD2E3] transition-colors"
              >
                المخرج النهائي
              </Link>
              <Link
                href="/#criteria"
                className="hover:text-[#8FD2E3] transition-colors"
              >
                معايير القبول
              </Link>
              <Link
                href="/#faq"
                className="hover:text-[#8FD2E3] transition-colors"
              >
                الأسئلة الشائعة
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/15">
        <div className="container mx-auto px-4 md:px-8 py-5 flex flex-col-reverse md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="text-white/60 pr-4 text-[10px] md:text-xs">
              أحد مشاريع
            </span>
            <img
              src="/ryadah_white.svg"
              alt="الريادة الاجتماعية"
              className="h-8 md:h-10 w-auto pr-1 object-contain"
            />
          </div>
          <p className="text-white/70 text-sm">
            جميع الحقوق محفوظة للريادة الاجتماعية © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
