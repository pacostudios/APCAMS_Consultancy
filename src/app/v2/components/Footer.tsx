"use client";

import Link from "next/link";

export default function V2Footer() {
  const services = [
    { name: "Psychotherapy", href: "/v2/service/psychotherapy" },
    { name: "Counseling", href: "/v2/service/counselling-services" },
    { name: "Meditation", href: "/v2/service/meditation-programs" },
    { name: "Personal Growth", href: "/v2/service/personal-growth" },
    { name: "Addiction Support", href: "/v2/service/addiction-support" },
    { name: "Healing & Recovery", href: "/v2/service/healing-recovery" },
  ];

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <Link href="/v2" className="text-2xl font-bold tracking-tighter text-white hover:opacity-80 transition-opacity">
            ALCHEMY<span className="text-teal-500">.</span>
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed">
            Integrating holistic healing and modern science to transform lives through psychotherapy and meditation.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold mb-6 text-slate-100 uppercase tracking-widest text-xs">Explore</h4>
          <ul className="space-y-4 text-sm text-slate-400 font-medium">
            <li><Link href="/v2" className="hover:text-teal-400 transition-colors">Home</Link></li>
            <li><Link href="/v2/about" className="hover:text-teal-400 transition-colors">About Us</Link></li>
            <li><Link href="/v2/service" className="hover:text-teal-400 transition-colors">Our Services</Link></li>
            <li><Link href="/v2/contact_us" className="hover:text-teal-400 transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-slate-100 uppercase tracking-widest text-xs">Services</h4>
          <ul className="space-y-4 text-sm text-slate-400 font-medium">
            {services.map((service) => (
              <li key={service.name}>
                <Link href={service.href} className="hover:text-teal-400 transition-colors">
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-slate-100 uppercase tracking-widest text-xs">Contact</h4>
          <ul className="space-y-4 text-sm text-slate-400 font-medium">
            <li>
              <a href="mailto:hello@alchemy-healing.com" className="hover:text-teal-400 transition-colors">
                hello@alchemy-healing.com
              </a>
            </li>
            <li className="hover:text-teal-400 transition-colors">755-336-6545</li>
            <li className="text-slate-500">123 Wellness Street</li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pt-20 mt-20 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">
        <p>© 2026 Alchemy Redesign. All rights reserved.</p>
        <div className="flex space-x-8 mt-4 md:mt-0">
          <Link href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-teal-400 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
