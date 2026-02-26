"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function Header({ sticky = false }: { sticky?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#hero");

  useEffect(() => {
    if (sticky) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    // Intersection Observer for active section highlighting
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );
    const sections = [
      "hero",
      "about",
      "stages",
      "benefits",
      "outputs",
      "criteria",
      "faq",
      // "contact",
    ];

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const navLinks = [
    { href: "/#hero", label: "الرئيسية" },
    { href: "/#benefits", label: "المميزات" },
    { href: "/#stages", label: "مراحل المشروع" },
    { href: "/#outputs", label: "المخرج النهائي" },
    { href: "/#criteria", label: "معايير القبول" },
    { href: "/#faq", label: "الأسئلة الشائعة" },
    // { href: "/#contact", label: "تواصل معنا" },
  ];

  const positionClass = sticky
    ? "absolute top-0 right-0 left-0"
    : "fixed top-0 right-0 left-0";

  return (
    <motion.header
      initial={sticky ? false : { y: -100 }}
      animate={sticky ? false : { y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`${positionClass} z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? "bg-white/90 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between gap-4 h-16 md:h-20">
          {/* Logos */}
          <Link href="/" className="flex items-center gap-3">
            {/* Al-Tamkeen Logo */}
            <div className="flex items-center gap-2">
              <div className="h-12 md:h-18 w-auto flex items-center justify-center">
                <img
                  src={
                    isScrolled || isMobileMenuOpen
                      ? "/tamkeen.svg"
                      : "/tamkeen_white.svg"
                  }
                  alt="Logo"
                  className="h-full w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 mx-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-all duration-300 relative py-1 ${
                  activeSection === link.href
                    ? isScrolled
                      ? "text-[#4B3D90]"
                      : "text-[#8FD2E3]"
                    : isScrolled
                      ? "text-gray-700 hover:text-[#4B3D90]"
                      : "text-white hover:text-[#8FD2E3]"
                }`}
              >
                {link.label}
                {activeSection === link.href && (
                  <motion.div
                    layoutId="activeNav"
                    className={`absolute bottom-0 right-0 left-0 h-0.5 ${
                      isScrolled ? "bg-[#4B3D90]" : "bg-[#8FD2E3]"
                    }`}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block ml-6">
            <Link
              href="/submit"
              className={`px-7 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 cursor-pointer border
                ${
                  isScrolled
                    ? "bg-[#4B3D90] text-white border-[#4B3D90] hover:bg-[#3a2f73] shadow-md shadow-[#4B3D90]/20"
                    : "bg-white text-[#4B3D90] border-white/80 hover:bg-white/90 shadow-md shadow-white/10"
                }`}
            >
              قدم الآن
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`h-0.5 w-full transition-all duration-300 ${
                  isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
                } ${isScrolled || isMobileMenuOpen ? "bg-[#4B3D90]" : "bg-white"}`}
              />
              <span
                className={`h-0.5 w-full transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-0" : ""
                } ${isScrolled || isMobileMenuOpen ? "bg-[#4B3D90]" : "bg-white"}`}
              />
              <span
                className={`h-0.5 w-full transition-all duration-300 ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                } ${isScrolled || isMobileMenuOpen ? "bg-[#4B3D90]" : "bg-white"}`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{
            height: isMobileMenuOpen ? "auto" : 0,
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          className="lg:hidden overflow-hidden bg-white rounded-b-2xl shadow-lg"
        >
          <nav className="flex flex-col p-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`py-3 font-medium transition-colors border-b border-gray-100 last:border-0 ${
                  activeSection === link.href
                    ? "text-[#8FD2E3]"
                    : "text-[#4B3D90] hover:text-[#8FD2E3]"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button
              asChild
              className="mt-4 bg-[#4B3D90] hover:bg-[#4A3D82] text-white rounded-full"
            >
              <Link href="/submit">قدم الآن</Link>
            </Button>
          </nav>
        </motion.div>
      </div>
    </motion.header>
  );
}
