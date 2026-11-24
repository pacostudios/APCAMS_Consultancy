"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  ChevronRight,
  MessageCircle,
  Calendar,
  User,
  AtSign,
  Smartphone,
  Sparkles,
  ArrowUpRight,
  Globe
} from "lucide-react";
import { SITE_ASSETS } from "@/lib/site-assets";
import { useI18n } from "@/i18n/LanguageProvider";
import { rich } from "@/i18n/format";

// CONFIGURATION: Update contact info here
const CONTACT_INFO = {
  landline: "0490 2082731",
  mobile: "+91 6282584049",
  whatsapp: "+61 498289780",
  emails: [
    { label: null, address: "info@alchemetanoia.com" }, // null: "General", translated
    { label: "James Varkey", address: "jmsvarkey@gmail.com" },
  ],
  website: "www.alchemetanoia.com",
  address: "42 Mosaic Street East, Shelley WA 6148",
  officeHours: [
    { day: "monFri", hours: "9:00 AM - 8:00 PM" },
    { day: "saturday", hours: "10:00 AM - 4:00 PM" },
    { day: "sunday", hours: null }
  ] as const,
  mapIframe: "https://www.google.com/maps?q=42+Mosaic+Street+East,+Shelley+WA+6148,+Australia&z=15&output=embed"
};

export default function V2ContactUs() {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    phoneNumber: "",
    serviceInterest: "",
    preferredTiming: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Form submitted:", formData);
    setIsSubmitting(false);
    alert(t.contact.sentAlert);
    setFormData({
      fullName: "",
      emailAddress: "",
      phoneNumber: "",
      serviceInterest: "",
      preferredTiming: "",
      message: "",
    });
  };

  return (
    <div className="space-y-24 md:space-y-32 pb-32 pt-28 md:pt-36">
      
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl space-y-6"
        >
          <div className="flex items-center gap-2 text-teal-600 font-bold tracking-widest text-xs uppercase">
            <span>{t.contact.breadcrumbHome}</span>
            <ChevronRight size={14} />
            <span className="opacity-60">{t.contact.breadcrumbContact}</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-slate-900 leading-tight">
            {rich(t.contact.title, { highlight: <span className="text-teal-600">{t.contact.titleHighlight}</span> })}
          </h1>
          <p className="text-lg md:text-xl text-slate-500 leading-relaxed font-medium">
            {t.contact.intro}
          </p>
        </motion.div>
      </section>

      {/* 2. CONTACT CONTENT GRID */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        
        {/* Contact Information (Left Column) */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-5 space-y-12"
        >
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <Sparkles className="text-teal-600" />
              {t.contact.infoHeading}
            </h2>
            
            <div className="space-y-6">
              {/* Phone */}
              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 border border-teal-100 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300 shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{t.contact.phone}</h4>
                  <p className="text-slate-500 font-medium">
                    <span className="text-slate-400 text-xs uppercase tracking-wide">{t.contact.landline}</span>
                    {CONTACT_INFO.landline}
                  </p>
                  <p className="text-slate-500 font-medium">
                    <span className="text-slate-400 text-xs uppercase tracking-wide">{t.contact.mobile}</span>
                    {CONTACT_INFO.mobile}
                  </p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 border border-teal-100 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300 shrink-0">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{t.contact.whatsapp}</h4>
                  <p className="text-slate-500 font-medium">{CONTACT_INFO.whatsapp}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 border border-teal-100 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300 shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">{t.contact.email}</h4>
                  {CONTACT_INFO.emails.map((e, i) => (
                    <p key={i} className="text-slate-500 font-medium">
                      <span className="text-slate-400 text-xs uppercase tracking-wide">{e.label ?? t.contact.emailGeneral}: </span>
                      <a href={`mailto:${e.address}`} className="hover:text-teal-600 transition-colors">{e.address}</a>
                    </p>
                  ))}
                </div>
              </div>

              {/* Website */}
              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 border border-teal-100 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300 shrink-0">
                  <Globe size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{t.contact.website}</h4>
                  <p className="text-slate-500 font-medium">{CONTACT_INFO.website}</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 border border-teal-100 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300 shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{t.contact.officeAddress}</h4>
                  <p className="text-slate-500 font-medium leading-relaxed">{CONTACT_INFO.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Clock className="text-teal-400" />
              {t.contact.hoursHeading}
            </h3>
            <div className="space-y-4">
              {CONTACT_INFO.officeHours.map((item, i) => (
                <div key={i} className="flex justify-between items-center border-b border-white/10 pb-4 last:border-0 last:pb-0">
                  <span className="text-slate-400 text-sm font-medium">{t.contact[item.day]}</span>
                  <span className="text-teal-400 text-sm font-bold">{item.hours ?? t.contact.closed}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Contact Form (Right Column) */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-7"
        >
          <div className="bg-white border border-slate-100 rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-slate-100">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <User size={14} className="text-teal-600" />
                    {t.contact.fullName}
                  </label>
                  <input
                    required
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder={t.contact.namePlaceholder}
                    className="w-full px-6 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-teal-600 transition-all font-medium text-slate-900"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <AtSign size={14} className="text-teal-600" />
                    {t.contact.emailAddress}
                  </label>
                  <input
                    required
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    placeholder="example@mail.com"
                    className="w-full px-6 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-teal-600 transition-all font-medium text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Smartphone size={14} className="text-teal-600" />
                    {t.contact.phoneNumber}
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+1 (000) 000-0000"
                    className="w-full px-6 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-teal-600 transition-all font-medium text-slate-900"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <MessageCircle size={14} className="text-teal-600" />
                    {t.contact.serviceInterest}
                  </label>
                  <select
                    name="serviceInterest"
                    value={formData.serviceInterest}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-teal-600 transition-all font-medium text-slate-900 appearance-none"
                  >
                    <option value="">{t.contact.selectService}</option>
                    <option value="psychotherapy">Psychotherapy</option>
                    <option value="counseling">Counseling Services</option>
                    <option value="meditation">Meditation Programs</option>
                    <option value="growth">Personal Growth</option>
                    <option value="addiction">Addiction Support</option>
                    <option value="recovery">Healing & Recovery</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={14} className="text-teal-600" />
                  {t.contact.preferredTiming}
                </label>
                <input
                  type="text"
                  name="preferredTiming"
                  value={formData.preferredTiming}
                  onChange={handleInputChange}
                  placeholder={t.contact.timingPlaceholder}
                  className="w-full px-6 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-teal-600 transition-all font-medium text-slate-900"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Send size={14} className="text-teal-600" />
                  {t.contact.yourMessage}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder={t.contact.messagePlaceholder}
                  className="w-full px-6 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-teal-600 transition-all font-medium text-slate-900 resize-none"
                ></textarea>
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full py-5 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-teal-600 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
              >
                {isSubmitting ? t.contact.sending : t.contact.send}
                <ArrowUpRight className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </form>
          </div>
        </motion.div>
      </section>

      {/* 3. MAP SECTION */}
      <section className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="w-full h-[500px] bg-slate-100 rounded-[3rem] overflow-hidden shadow-2xl relative flex items-center justify-center"
        >
          {SITE_ASSETS.CONTACT.mapPlaceholder ? (
            <Image 
              src={SITE_ASSETS.CONTACT.mapPlaceholder}
              alt="Location Map"
              fill
              className="object-cover grayscale"
            />
          ) : (
            <iframe
              src={CONTACT_INFO.mapIframe}
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(0.2) contrast(1.1)" }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          )}
        </motion.div>
      </section>

    </div>
  );
}
