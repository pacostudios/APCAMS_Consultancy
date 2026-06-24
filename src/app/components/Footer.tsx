import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function APCAMSFooter() {
  return (
    <footer className="bg-slate-700 text-white mt-[128px] lg:rounded-tr-[2rem] lg:rounded-tl-[2rem] rounded-bl-none rounded-br-none">
      {/* Main Footer Content */}
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold tracking-wide">APCAMS</h2>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Services
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Services</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Psychotherapy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Counselling
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Meditation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Healing Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-center">
                <Phone size={16} className="text-teal-400 mr-3 flex-shrink-0" />
                <span className="text-gray-300">7653936845</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="text-teal-400 mr-3 flex-shrink-0" />
                <a 
                  href="mailto:hello@APCAMS-healing.com" 
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  hello@APCAMS-healing.com
                </a>
              </li>
              <li className="flex items-center">
                <MapPin size={16} className="text-teal-400 mr-3 flex-shrink-0" />
                <span className="text-gray-300">123 Wellness Street</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-slate-600">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-16 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div className="mb-2 md:mb-0">
              © 2024 APCAMS. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}