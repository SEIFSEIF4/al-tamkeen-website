"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#hero");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Intersection Observer for active section highlighting
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
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
      "contact",
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
    { href: "#hero", label: "الرئيسية" },
    { href: "#stages", label: "مراحل البرنامج" },
    { href: "#benefits", label: "المميزات" },
    { href: "#outputs", label: "المخرجات" },
    { href: "#contact", label: "تواصل معنا" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? "bg-white/90 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10  rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src="/logo.svg"
                  alt="Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const fallback =
                      e.currentTarget.parentElement?.querySelector(
                        ".fallback-logo",
                      );
                    if (fallback)
                      (fallback as HTMLElement).style.display = "flex";
                  }}
                />
                <div className="fallback-logo hidden w-6 h-6 border-2 border-white rounded-sm"></div>
              </div>
              <div className="flex flex-col">
                <span
                  className={`font-bold text-lg ${isScrolled || isMobileMenuOpen ? "text-[#4B3D90]" : "text-white"}`}
                >
                  التمكين الريادي
                </span>
                <span
                  className={`text-xs ${isScrolled ? "text-[#8FD2E3]" : "text-[#8FD2E3]"}`}
                >
                  للجمعيات الأهلية
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-all duration-300 relative py-1 ${
                  activeSection === link.href
                    ? "text-[#8FD2E3]"
                    : isScrolled
                      ? "text-gray-700 hover:text-[#8FD2E3]"
                      : "text-white hover:text-[#8FD2E3]"
                }`}
              >
                {link.label}
                {activeSection === link.href && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 right-0 left-0 h-0.5 bg-[#8FD2E3]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <button
              className={` px-6 py-2 rounded-full font-medium transition-all text-gray-700 hover:scale-105 cursor-pointer
                ${isScrolled ? "bg-[#8FD2E3]" : "bg-white "}`}
            >
              <Link href="#contact">سجل الآن</Link>
            </button>
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
              <Link href="#contact">سجل الآن</Link>
            </Button>
          </nav>
        </motion.div>
      </div>
    </motion.header>
  );
}
