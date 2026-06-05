"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { 
  ArrowUpRight, 
  ShieldCheck, 
  UserCircle, 
  Leaf, 
  HeartHandshake, 
  Lightbulb, 
  Sparkles, 
  Star,
  GraduationCap,
  Award,
  Users
} from "lucide-react";
import { SITE_ASSETS } from "@/lib/site-assets";

export default function V2About() {
  const philosophy = [
    {
      title: "Safety First",
      desc: "We prioritize creating a secure, non-judgmental environment where vulnerability is honored and authentic expression is welcomed.",
      icon: <ShieldCheck className="w-8 h-8 text-teal-600" />
    },
    {
      title: "Personalized Approach",
      desc: "No two healing journeys are alike. We carefully tailor our interventions to match your unique needs, preferences, and goals.",
      icon: <UserCircle className="w-8 h-8 text-teal-600" />
    },
    {
      title: "Holistic Integration",
      desc: "We address the whole person - mind, body, and spirit. Our approach integrates cognitive, emotional, somatic, and spiritual dimensions.",
      icon: <Leaf className="w-8 h-8 text-teal-600" />
    }
  ];

  const values = [
    { label: "Compassion", icon: <HeartHandshake className="w-8 h-8 text-teal-700" /> },
    { label: "Growth Mindset", icon: <Lightbulb className="w-8 h-8 text-teal-700" /> },
    { label: "Authenticity", icon: <Sparkles className="w-8 h-8 text-teal-700" /> },
    { label: "Excellence", icon: <Star className="w-8 h-8 text-teal-700" /> }
  ];

  return (
    <div className="space-y-24 md:space-y-32 pb-32 pt-10">
      
      {/* 1. HERO / ABOUT INTRO */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 md:space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-xs font-bold tracking-wide">
            <Leaf size={16} />
            ABOUT ALCHEMY
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
            Healing Through <br className="hidden md:block" /> Integrated Care
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed font-medium">
            Our comprehensive approach combines cutting-edge therapeutic techniques with ancient wisdom, 
            creating a unique space where science meets soul, and where every individual's journey is 
            honored and supported with the utmost care and respect.
          </p>
          <div className="pt-4">
            <Link href="/v2/service">
              <button className="inline-flex px-8 py-4 bg-teal-600 text-white rounded-full font-bold text-sm hover:bg-slate-900 transition-all items-center gap-2 group shadow-lg shadow-teal-100">
                EXPLORE OUR SERVICES
                <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          {/* Custom shaped image container (Arch style) */}
          <div className="relative aspect-[4/5] md:aspect-square w-full max-w-[500px] mx-auto lg:ml-auto rounded-t-full rounded-b-[3rem] overflow-hidden shadow-2xl bg-slate-100">
             <Image 
                src={SITE_ASSETS.ABOUT.hero.src}
                alt={SITE_ASSETS.ABOUT.hero.alt}
                fill
                className="object-cover"
                priority
             />
          </div>
          {/* Subtle background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-slate-100 rounded-full -z-10"></div>
        </motion.div>
      </section>

      {/* 2. TREATMENT PHILOSOPHY */}
      <section className="max-w-7xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">Our Treatment Philosophy</h2>
          <div className="flex items-center justify-center gap-4 text-teal-200">
            <div className="h-px w-12 bg-slate-200"></div>
            <Leaf size={20} className="text-teal-600" />
            <div className="h-px w-12 bg-slate-200"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {philosophy.map((item, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              key={i} 
              className="bg-white border border-slate-100 rounded-[2.5rem] p-10 text-center space-y-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-20 h-20 mx-auto bg-teal-50/50 rounded-full flex items-center justify-center border border-teal-100">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm md:text-base">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. CORE VALUES */}
      <section className="max-w-6xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-slate-50/80 rounded-[3rem] p-12 md:p-16 border border-slate-100 relative overflow-hidden"
        >
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Our Core Values</h2>
              <div className="flex items-center justify-center gap-4 text-teal-200">
                <div className="h-px w-8 bg-slate-200"></div>
                <Leaf size={16} className="text-teal-600" />
                <div className="h-px w-8 bg-slate-200"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-200/50">
              {values.map((value, i) => (
                <div key={i} className="flex flex-col items-center justify-center text-center space-y-4 pt-8 md:pt-0 first:pt-0 md:first:pt-0">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                    {value.icon}
                  </div>
                  <span className="font-bold text-slate-900">{value.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* 4. MEET OUR TEAM (FOUNDER) */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="bg-white border border-slate-100 rounded-[3rem] p-8 md:p-12 shadow-xl shadow-slate-100/50 flex flex-col lg:flex-row gap-12 items-center relative overflow-hidden">
          {/* Decoration */}
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          {/* Founder Image */}
          <div className="relative w-full lg:w-[400px] shrink-0">
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-100 relative z-10">
              <Image 
                src={SITE_ASSETS.ABOUT.team.drSarah.src}
                alt={SITE_ASSETS.ABOUT.team.drSarah.alt}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Founder Bio */}
          <div className="flex-1 space-y-8 relative z-10">
            <div className="space-y-2">
              <div className="text-teal-600 font-bold tracking-widest uppercase text-xs">Meet Our Founder</div>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">Chacko (James) Vadayil Varkey</h2>
              <p className="text-xl text-slate-500 font-medium">Clinical Psychotherapist & Accredited FDRP</p>
            </div>
            
            <div className="h-px w-full max-w-[200px] bg-slate-100"></div>

            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                Chacko is a clinical psychotherapist credentialed with PACFA and an Accredited Family Dispute Resolution Practitioner. His multi-disciplinary background spans theology, criminology, psychology, and family law.
              </p>
              <p>
                He specializes in working with individuals, families, and couples from diverse cultural and linguistic backgrounds. His spiritually integrative approach focuses on creating a safe, non-judgmental environment to navigate trauma, anxiety, and complex relationships.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
              <div className="flex flex-col items-start md:items-center text-left md:text-center space-y-2">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <GraduationCap className="w-6 h-6 text-teal-600" />
                </div>
                <span className="text-sm font-bold text-slate-800">Clinical<br/>Psychotherapist</span>
              </div>
              <div className="flex flex-col items-start md:items-center text-left md:text-center space-y-2">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <Award className="w-6 h-6 text-teal-600" />
                </div>
                <span className="text-sm font-bold text-slate-800">12+ Years<br/>Experience</span>
              </div>
              <div className="flex flex-col items-start md:items-center text-left md:text-center space-y-2">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <span className="text-sm font-bold text-slate-800">Family<br/>Mediation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
