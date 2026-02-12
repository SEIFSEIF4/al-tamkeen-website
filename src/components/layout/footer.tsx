"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="bg-[#4B3D90] text-white">
      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col-reverse w-full lg:flex-row justify-start items-center lg:items-start gap-12">
          {/* Right Side: Logo */}
          <div className="flex flex-col md:w-1/4 w-full items-start justify-start ">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <h2 className="text-2xl font-bold leading-tight">التمكين</h2>
                <h2 className="text-2xl font-bold leading-tight">الريادي</h2>
                <span className="text-xs text-[#8FD2E3] tracking-wider mt-1">
                  للجمعيــات الأهليــة
                </span>
              </div>
              <div className="w-12 h-12 relative flex items-center justify-center">
                <img
                  src="/logo.svg"
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Center: Navigation Links */}
          <div className="flex flex-wrap md:w-3/4 w-full justify-start items-start gap-x-16 gap-y-8 text-center lg:text-right">
            <div className="flex flex-col gap-4 text-white/90 font-medium">
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
                فكرة البرنامج
              </Link>
            </div>
            <div className="flex flex-col gap-4 text-white/90 font-medium">
              <Link
                href="/#stages"
                className="hover:text-[#8FD2E3] transition-colors"
              >
                مراحل البرنامج
              </Link>
              <Link
                href="/#benefits"
                className="hover:text-[#8FD2E3] transition-colors"
              >
                المميزات
              </Link>
            </div>
            <div className="flex flex-col gap-4 text-white/90 font-medium">
              <Link
                href="/#outputs"
                className="hover:text-[#8FD2E3] transition-colors"
              >
                المخرج الأخير
              </Link>
              <Link
                href="/#criteria"
                className="hover:text-[#8FD2E3] transition-colors"
              >
                معايير القبول
              </Link>
            </div>
            <div className="flex flex-col gap-4 text-white/90 font-medium">
              <Link
                href="/#faq"
                className="hover:text-[#8FD2E3] transition-colors"
              >
                أسئلة شائعة
              </Link>

              <Link
                href="/#contact"
                className="hover:text-[#8FD2E3] transition-colors"
              >
                تواصل معنا
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
