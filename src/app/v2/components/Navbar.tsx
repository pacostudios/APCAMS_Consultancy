"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Sparkles, Brain, Heart, Compass, Target, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function V2Navbar({ forceSolid = false }: { forceSolid?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/v2" },
    { name: "About", href: "/v2/about" },
  ];

  const services = [
    { name: "Psychotherapy", href: "/v2/service/psychotherapy", icon: <Brain size={16} /> },
    { name: "Counseling", href: "/v2/service/counselling-services", icon: <Heart size={16} /> },
    { name: "Meditation", href: "/v2/service/meditation-programs", icon: <Compass size={16} /> },
    { name: "Personal Growth", href: "/v2/service/personal-growth", icon: <Target size={16} /> },
    { name: "Addiction Recovery Support", href: "/v2/service/addiction-support", icon: <ShieldCheck size={16} /> },
    { name: "Healing & Transformation", href: "/v2/service/healing-recovery", icon: <Sparkles size={16} /> },
  ];

  const isActive = (path: string) => pathname === path;

  const isLandingPage = pathname === "/v2" || pathname === "/v2/";
  const isSolid = scrolled || forceSolid || isOpen || !isLandingPage;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full pointer-events-none">
      <nav
        className={`pointer-events-auto transition-all duration-500 ease-in-out ${
          isSolid
            ? "w-full max-w-full bg-white/95 backdrop-blur-lg shadow-md py-3 px-6 md:px-12 rounded-none mt-0 border-b border-slate-100"
            : "w-[calc(100%-2rem)] max-w-6xl bg-white border border-slate-100 shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] rounded-2xl md:rounded-full py-2 px-6 md:px-8 mt-3 md:mt-4"
        }`}
      >
        <div className="w-full flex justify-between items-center">
        {/* Logo */}
        <Link href="/v2" className={`flex items-center transition-all duration-500 ${isSolid ? "gap-3" : "gap-2"}`}>
          <Image 
            src="/logo.webp" 
            alt="APCAMS" 
            width={56} 
            height={56} 
            className={`w-auto object-contain transition-all duration-500 ${isSolid ? "h-11 md:h-12" : "h-9 md:h-10"}`} 
          />
          <div className="flex flex-col leading-tight">
            <span className={`font-extrabold tracking-tight text-slate-900 transition-all duration-500 ${isSolid ? "text-xl md:text-2xl" : "text-lg md:text-xl"}`}>
              APCAMS
            </span>
            <span className={`font-bold tracking-wide text-teal-700 transition-all duration-500 ${isSolid ? "text-[8px] md:text-[10px]" : "text-[7px] md:text-[8px]"}`}>
              ALCHEMY PSYCHOTHERAPY, COUNSELLING AND MEDIATION SERVICES
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-semibold transition-colors hover:text-teal-600 ${
                isActive(link.href) ? "text-teal-600" : "text-slate-600"
              }`}
            >
              {link.name.toUpperCase()}
            </Link>
          ))}

          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => setIsServicesOpen(false)}
          >
            <button
              className={`text-sm font-semibold transition-colors hover:text-teal-600 flex items-center gap-1 uppercase ${
                pathname.startsWith("/v2/service") ? "text-teal-600" : "text-slate-600"
              }`}
            >
              Services
              <ChevronDown size={14} className={`transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {isServicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
                >
                  <div className="p-2">
                    {services.map((service) => (
                      <Link
                        key={service.name}
                        href={service.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-teal-50 text-slate-600 hover:text-teal-700 transition-colors"
                        onClick={() => setIsServicesOpen(false)}
                      >
                        <div className="text-teal-600">{service.icon}</div>
                        <span className="text-sm font-bold">{service.name}</span>
                      </Link>
                    ))}
                    <div className="mt-2 pt-2 border-t border-slate-50">
                      <Link
                        href="/v2/service"
                        className="flex items-center justify-center px-4 py-2 text-xs font-bold text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        onClick={() => setIsServicesOpen(false)}
                      >
                        VIEW ALL SERVICES
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/v2/contact_us"
            className={`text-sm font-semibold transition-colors hover:text-teal-600 ${
              isActive("/v2/contact_us") ? "text-teal-600" : "text-slate-600"
            }`}
          >
            CONTACT US
          </Link>

          <Link 
            href="/v2/book_appointment"
            className={`bg-slate-900 text-white font-bold rounded-full hover:bg-teal-600 transition-all transform hover:scale-105 transition-all duration-500 whitespace-nowrap flex items-center justify-center ${
              isSolid ? "px-6 py-2.5 text-sm" : "px-4 md:px-5 py-1.5 md:py-2 text-xs md:text-sm"
            }`}
          >
            BOOK YOUR SESSION
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white border-b overflow-hidden shadow-xl"
          >
            <div className="p-6 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-lg font-bold ${
                    isActive(link.href) ? "text-teal-600" : "text-slate-900"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="space-y-2">
                <button 
                  onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                  className="w-full flex items-center justify-between text-lg font-bold text-slate-900"
                >
                  Services
                  <ChevronDown size={20} className={`transition-transform duration-300 ${isMobileServicesOpen ? "rotate-180" : ""}`} />
                </button>
                
                <AnimatePresence>
                  {isMobileServicesOpen && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 gap-1 pl-4 pt-2 pb-2">
                        {services.map((service) => (
                          <Link
                            key={service.name}
                            href={service.href}
                            className="flex items-center gap-3 py-3 text-slate-600 font-bold text-sm hover:text-teal-600 transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            <div className="text-teal-600">{service.icon}</div>
                            {service.name}
                          </Link>
                        ))}
                        <Link
                          href="/v2/service"
                          className="py-3 text-teal-600 font-bold text-xs uppercase tracking-widest pl-7"
                          onClick={() => setIsOpen(false)}
                        >
                          View All Services
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/v2/contact_us"
                className={`text-lg font-bold ${
                  isActive("/v2/contact_us") ? "text-teal-600" : "text-slate-900"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Contact Us
              </Link>

              <Link 
                href="/v2/book_appointment"
                className="w-full py-4 bg-teal-600 text-white text-center font-bold rounded-xl"
                onClick={() => setIsOpen(false)}
              >
                Book Appointment
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </nav>
    </div>
  );
}
