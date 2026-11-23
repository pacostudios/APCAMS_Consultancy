"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ChevronDown, Sparkles, Brain, Heart, Compass, Target, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { authClient } from "@/lib/auth-client";
import type { Lang } from "@/i18n/config";
import { useI18n } from "@/i18n/LanguageProvider";
import LanguageSwitcher from "./LanguageSwitcher";

/** Desktop navbar sizing, so the logo, links and account area never overlap. */
function navFit(lang: Lang, signedIn: boolean, solid: boolean) {
  const base = { desktop: "hidden lg:flex", mobile: "lg:hidden", accountGap: "gap-5 xl:gap-6", accountText: "text-sm", islandPad: "px-6 xl:px-8" };
  const floatingTag = "text-[7px] md:text-[8px] lg:hidden xl:block";
  const solidTag = "text-[8px] md:text-[10px] lg:hidden xl:block";
  const tight = { accountGap: "gap-3 xl:gap-4", accountText: "text-xs xl:text-sm", islandPad: "px-5" };

  if (lang === "ml" && signedIn)
    return {
      ...base,
      ...tight,
      accountText: solid ? "text-xs 2xl:text-sm" : "text-xs",
      // Doesn't fit between 1024px and 1280px: use the menu button there instead.
      desktop: "hidden xl:flex",
      mobile: "xl:hidden",
      link: solid ? "text-xs 2xl:text-sm" : "text-xs",
      gap: solid ? "gap-4 2xl:gap-6" : "gap-4",
      button: solid ? "px-4 py-2 text-xs 2xl:px-6 2xl:text-sm" : "px-4 py-2 text-xs",
      tagline: solid ? "text-[8px] md:text-[10px] xl:hidden 2xl:block" : "text-[7px] md:text-[8px] xl:hidden",
    };
  if (lang === "ml")
    return {
      ...base,
      link: "text-xs xl:text-sm",
      gap: solid ? "gap-3 xl:gap-5 2xl:gap-8" : "gap-3 xl:gap-5",
      button: "px-4 py-2 text-xs xl:px-5 xl:text-sm",
      tagline: solid ? solidTag : floatingTag,
    };
  if (lang === "hi")
    return { ...base, link: "text-xs xl:text-sm", gap: "gap-3 xl:gap-8", button: "px-4 py-2 text-xs xl:px-6 xl:text-sm", tagline: solid ? solidTag : floatingTag };
  if (signedIn)
    return {
      ...base,
      ...tight,
      link: "text-xs min-[1366px]:text-sm",
      gap: solid ? "gap-3 xl:gap-5 2xl:gap-8" : "gap-3 xl:gap-5",
      button: "px-4 py-2 text-xs min-[1366px]:px-5 min-[1366px]:text-sm",
      tagline: solid ? "text-[8px] min-[1440px]:text-[10px] lg:hidden xl:block xl:whitespace-nowrap" : `${floatingTag} xl:whitespace-nowrap`,
    };
  return {
    ...base,
    link: "text-sm",
    gap: "gap-5 xl:gap-6 min-[1366px]:gap-8",
    button: solid ? "px-6 py-2.5 text-sm" : "px-5 py-2 text-sm",
    tagline: `${solid ? solidTag : floatingTag} xl:whitespace-nowrap`,
  };
}

export default function V2Navbar({ forceSolid = false }: { forceSolid?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const { t, lang } = useI18n();
  // How much the desktop bar has to fit depends on the language (Malayalam is widest) and on being signed in
  // (My Account + Sign out). The floating bar never grows past 1280px, so only the solid bar relaxes at 2xl.
  const fit = navFit(lang, Boolean(session), scrolled || forceSolid || isOpen || pathname !== "/");

  // Signed-in admins go to the admin dashboard, customers to their account.
  const role = (session?.user as { role?: string } | undefined)?.role;
  const accountLink = !session
    ? { name: t.nav.login, href: "/login" }
    : role === "admin"
      ? { name: t.nav.dashboard, href: "/dashboard" }
      : role === "staff"
        ? { name: t.nav.staffPortal, href: "/staff" }
        : { name: t.nav.myAccount, href: "/account" };

  const router = useRouter();
  const signOut = async () => {
    setIsOpen(false);
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t.nav.home, href: "/" },
    { name: t.nav.about, href: "/about" },
  ];

  const services = [
    { name: "Psychotherapy", href: "/service/psychotherapy", icon: <Brain size={16} /> },
    { name: "Counseling", href: "/service/counselling-services", icon: <Heart size={16} /> },
    { name: "Meditation", href: "/service/meditation-programs", icon: <Compass size={16} /> },
    { name: "Personal Growth", href: "/service/personal-growth", icon: <Target size={16} /> },
    { name: "Addiction & Recovery Support", href: "/service/addiction-support", icon: <ShieldCheck size={16} /> },
    { name: "Healing & Transformation", href: "/service/healing-recovery", icon: <Sparkles size={16} /> },
  ];

  const isActive = (path: string) => pathname === path;

  const isLandingPage = pathname === "/";
  const isSolid = scrolled || forceSolid || isOpen || !isLandingPage;
  const islandClass = "bg-white border border-slate-100 shadow-[0_8px_32px_0_rgba(0,0,0,0.06)]";

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full pointer-events-none">
      {/* Floating: two islands (site links | account + booking). Solid: they merge into one full-width bar. */}
      <nav
        // Only size and spacing animate. Background, border and shadow switch instantly: fading them while the bar
        // shrinks left a white strip and the bottom border visible mid-transition.
        className={`pointer-events-auto flex items-stretch border-b transition-[width,max-width,margin,padding,gap] duration-500 ease-in-out ${
          isSolid
            ? "w-full max-w-full bg-white/95 backdrop-blur-lg shadow-md py-3 px-6 md:px-12 rounded-none mt-0 border-slate-100 gap-5 xl:gap-8"
            : "w-[calc(100%-2rem)] max-w-7xl mt-3 md:mt-4 gap-3 border-transparent"
        }`}
      >
        <div
          className={`flex-1 min-w-0 flex justify-between items-center transition-[padding,border-radius] duration-500 ${
            isSolid ? "" : `${islandClass} rounded-2xl md:rounded-full py-2 px-6 md:px-8`
          }`}
        >
        {/* Logo */}
        <Link href="/" className={`flex items-center transition-all duration-500 ${isSolid ? "gap-3" : "gap-2"}`}>
          <Image 
            src="/logo.webp" 
            alt="Alchemetanoia" 
            width={56} 
            height={56} 
            className={`w-auto object-contain transition-all duration-500 ${isSolid ? "h-11 md:h-12" : "h-9 md:h-10"}`} 
          />
          <div className="flex flex-col leading-tight">
            <span className={`font-extrabold tracking-tight text-slate-900 transition-all duration-500 ${isSolid ? "text-xl md:text-2xl" : "text-lg md:text-xl"}`}>
               AlcheMetanoia
            </span>
            <span className={`font-bold tracking-wide text-teal-700 transition-all duration-500 ${fit.tagline}`}>
              {t.nav.tagline}
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className={`${fit.desktop} items-center whitespace-nowrap ${fit.gap}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${fit.link} font-semibold transition-colors hover:text-teal-600 ${
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
              className={`${fit.link} font-semibold transition-colors hover:text-teal-600 flex items-center gap-1 uppercase ${
                pathname.startsWith("/service") ? "text-teal-600" : "text-slate-600"
              }`}
            >
              {t.nav.services}
              <ChevronDown size={14} className={`transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {isServicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 w-max min-w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
                >
                  <div className="p-2">
                    {services.map((service) => (
                      <Link
                        key={service.name}
                        href={service.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-teal-50 text-slate-600 hover:text-teal-700 transition-colors"
                        onClick={() => setIsServicesOpen(false)}
                      >
                        <div className="text-teal-600 shrink-0">{service.icon}</div>
                        <span className="text-sm font-bold">{service.name}</span>
                      </Link>
                    ))}
                    <div className="mt-2 pt-2 border-t border-slate-50">
                      <Link
                        href="/service"
                        className="flex items-center justify-center px-4 py-2 text-xs font-bold text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        onClick={() => setIsServicesOpen(false)}
                      >
                        {t.nav.viewAllServices.toUpperCase()}
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/contact_us"
            className={`${fit.link} font-semibold transition-colors hover:text-teal-600 ${
              isActive("/contact_us") ? "text-teal-600" : "text-slate-600"
            }`}
          >
            {t.nav.contact.toUpperCase()}
          </Link>

          <Link
            href="/book_appointment"
            className={`bg-slate-900 text-white font-bold rounded-full hover:bg-teal-600 transition-all transform hover:scale-105 duration-500 whitespace-nowrap flex items-center justify-center ${
              fit.button
            }`}
          >
            {t.nav.bookSession.toUpperCase()}
          </Link>
        </div>

        {/* Mobile: language + menu toggle */}
        <div className={`${fit.mobile} flex items-center gap-1`}>
          <LanguageSwitcher />
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

        {/* Account island: Login, or My Account + Sign out */}
        <div
          className={`${fit.desktop} shrink-0 items-center whitespace-nowrap transition-[padding,border-radius] duration-500 ${
            isSolid ? "" : `${islandClass} rounded-full py-2 ${fit.islandPad}`
          }`}
        >
          <LanguageSwitcher className="mr-3 xl:mr-4" />
          <div className={`flex items-center ${fit.accountGap} transition-opacity ${sessionLoading ? "opacity-0" : "opacity-100"}`}>
            <Link
              href={accountLink.href}
              aria-busy={sessionLoading}
              className={`${fit.accountText} font-semibold transition-colors hover:text-teal-600 uppercase ${
                pathname.startsWith(accountLink.href) ? "text-teal-600" : "text-slate-600"
              }`}
            >
              {accountLink.name}
            </Link>
            {session && (
              <button type="button" onClick={signOut} className={`${fit.accountText} font-semibold text-slate-600 hover:text-teal-600 transition-colors uppercase`}>
                {t.nav.signOut}
              </button>
            )}
          </div>
        </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`${fit.mobile} absolute top-full left-0 right-0 bg-white border-b overflow-hidden shadow-xl`}
          >
            <div className="p-6 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
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
                  {t.nav.services}
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
                            <div className="text-teal-600 shrink-0">{service.icon}</div>
                            {service.name}
                          </Link>
                        ))}
                        <Link
                          href="/service"
                          className="py-3 text-teal-600 font-bold text-xs uppercase tracking-widest pl-7"
                          onClick={() => setIsOpen(false)}
                        >
                          {t.nav.viewAllServices}
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/contact_us"
                className={`text-lg font-bold ${
                  isActive("/contact_us") ? "text-teal-600" : "text-slate-900"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {t.nav.contact}
              </Link>

              {!sessionLoading && (
                <Link
                  href={accountLink.href}
                  className={`text-lg font-bold ${
                    pathname.startsWith(accountLink.href) ? "text-teal-600" : "text-slate-900"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {accountLink.name}
                </Link>
              )}

              {session && (
                <button type="button" onClick={signOut} className="text-left text-lg font-bold text-slate-900 hover:text-teal-600">
                  {t.nav.signOut}
                </button>
              )}

              <Link 
                href="/book_appointment"
                className="w-full py-4 bg-teal-600 text-white text-center font-bold rounded-xl"
                onClick={() => setIsOpen(false)}
              >
                {t.nav.bookAppointment}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </nav>
    </div>
  );
}
