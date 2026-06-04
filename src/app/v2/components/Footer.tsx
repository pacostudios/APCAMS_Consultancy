"use client";

import Link from "next/link";

export default function V2Footer() {
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold tracking-tighter text-white">ALCHEMY<span className="text-teal-500">.</span></h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Integrating holistic healing and modern science to transform lives through psychotherapy and meditation.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold mb-6 text-slate-100">Explore</h4>
          <ul className="space-y-4 text-sm text-slate-400 font-medium">
            <li><Link href="/v2" className="hover:text-teal-400 transition-colors">Home</Link></li>
            <li><Link href="/v2/about" className="hover:text-teal-400 transition-colors">About Us</Link></li>
            <li><Link href="/v2/service" className="hover:text-teal-400 transition-colors">Services</Link></li>
            <li><Link href="/v2/contact_us" className="hover:text-teal-400 transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-slate-100">Services</h4>
          <ul className="space-y-4 text-sm text-slate-400 font-medium">
            <li className="hover:text-teal-400 cursor-pointer transition-colors">Psychotherapy</li>
            <li className="hover:text-teal-400 cursor-pointer transition-colors">Counseling</li>
            <li className="hover:text-teal-400 cursor-pointer transition-colors">Meditation</li>
            <li className="hover:text-teal-400 cursor-pointer transition-colors">Addiction Support</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-slate-100">Contact</h4>
          <ul className="space-y-4 text-sm text-slate-400 font-medium">
            <li className="hover:text-teal-400 cursor-pointer transition-colors">hello@alchemy-healing.com</li>
            <li className="hover:text-teal-400 cursor-pointer transition-colors">755-336-6545</li>
            <li>123 Wellness Street</li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pt-20 mt-20 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 font-bold tracking-widest uppercase">
        <p>© 2026 Alchemy Redesign. All rights reserved.</p>
        <div className="flex space-x-8 mt-4 md:mt-0">
          <a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-teal-400 transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
}
