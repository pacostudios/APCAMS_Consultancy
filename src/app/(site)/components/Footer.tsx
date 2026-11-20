"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/i18n/LanguageProvider";

export default function V2Footer() {
  const { t } = useI18n();
  // Service names stay in English in every language.
  const services = [
    { name: "Psychotherapy", href: "/service/psychotherapy" },
    { name: "Counseling", href: "/service/counselling-services" },
    { name: "Meditation", href: "/service/meditation-programs" },
    { name: "Personal Growth", href: "/service/personal-growth" },
    { name: "Addiction Support", href: "/service/addiction-support" },
    { name: "Healing & Recovery", href: "/service/healing-recovery" },
  ];

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image src="/logo.webp" alt="Alchemetanoia" width={44} height={44} className="h-10 w-auto object-contain brightness-0 invert" />
            <span className="text-2xl font-bold tracking-tighter text-white">ALCHEMETANOIA</span>
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed">
            {t.footer.blurb}
          </p>
        </div>
        
        <div>
          <h4 className="font-bold mb-6 text-slate-100 uppercase tracking-widest text-xs">{t.footer.explore}</h4>
          <ul className="space-y-4 text-sm text-slate-400 font-medium">
            <li><Link href="/" className="hover:text-teal-400 transition-colors">{t.footer.home}</Link></li>
            <li><Link href="/about" className="hover:text-teal-400 transition-colors">{t.footer.aboutUs}</Link></li>
            <li><Link href="/service" className="hover:text-teal-400 transition-colors">{t.footer.ourServices}</Link></li>
            <li><Link href="/contact_us" className="hover:text-teal-400 transition-colors">{t.footer.contactUs}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-slate-100 uppercase tracking-widest text-xs">{t.footer.services}</h4>
          <ul className="space-y-4 text-sm text-slate-400 font-medium">
            {services.map((service) => (
              <li key={service.name} lang="en">
                <Link href={service.href} className="hover:text-teal-400 transition-colors">
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-slate-100 uppercase tracking-widest text-xs">{t.footer.contact}</h4>
          <ul className="space-y-4 text-sm text-slate-400 font-medium">
            <li>
              <a href="mailto:info@alchemetanoia.com" className="hover:text-teal-400 transition-colors">
                info@alchemetanoia.com
              </a>
            </li>
            <li className="hover:text-teal-400 transition-colors">0490 2082731</li>
            <li className="text-slate-500">{t.footer.location}</li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pt-20 mt-20 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">
        <p>{t.footer.rights}</p>
        <div className="flex space-x-8 mt-4 md:mt-0">
          <Link href="#" className="hover:text-teal-400 transition-colors">{t.footer.privacy}</Link>
          <Link href="#" className="hover:text-teal-400 transition-colors">{t.footer.terms}</Link>
        </div>
      </div>
    </footer>
  );
}
