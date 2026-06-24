"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { 
  ArrowUpRight, 
  Target, 
  ShieldCheck, 
  Leaf, 
  Sparkles, 
  Brain, 
  MessageCircle, 
  CheckCircle2, 
  CalendarDays, 
  ChevronRight, 
  Clock,
  Zap,
  ShieldAlert
} from "lucide-react";

import { SITE_ASSETS } from "@/lib/site-assets";

// CONFIGURATION: Content managed here, Images managed in @/lib/site-assets.ts
const SERVICE_PAGE_CONTENT = {
  hero: {
    title: "Our Services",
    description: "Comprehensive healing and wellness services designed to support your unique journey of growth, recovery, and transformation.",
    image: SITE_ASSETS.SERVICES_LANDING.hero.src
  },
  services: [
    {
      title: "Personal Growth",
      slug: "personal-growth",
      desc: "Our personal growth programs combine therapeutic insights with life coaching strategies to help you identify your values, set meaningful goals, and create the life you envision.",
      icon: <Target className="w-8 h-8 text-teal-600" />,
      includes: ["Life Coaching", "Goal Setting & Achievement", "Self-Discovery Sessions", "Confidence Building", "Career Guidance", "Personal Development"]
    },
    {
      title: "Addiction Support",
      slug: "addiction-support",
      desc: "Our addiction support services provide evidence-based treatment for substance abuse and behavioral addictions with a focus on long-term recovery.",
      icon: <ShieldCheck className="w-8 h-8 text-teal-600" />,
      includes: ["Addiction Assessment", "Recovery Planning", "Relapse Prevention", "Support Groups", "Family Support", "Ongoing Monitoring"]
    },
    {
      title: "Meditation & Mindfulness",
      slug: "meditation-programs",
      desc: "Learn the transformative power of mindfulness through our structured meditation programs designed for stress reduction and emotional balance.",
      icon: <Leaf className="w-8 h-8 text-teal-600" />,
      includes: ["Guided Meditation Sessions", "Mindfulness Training", "Stress Reduction Programs", "Wellness Retreats", "Breathwork Techniques", "Daily Practice Support"]
    },
    {
      title: "Healing & Recovery",
      slug: "healing-recovery",
      desc: "Our healing and recovery programs provide compassionate support for those experiencing grief, trauma, or emotional distress.",
      icon: <Sparkles className="w-8 h-8 text-teal-600" />,
      includes: ["Grief Counseling", "Trauma Recovery", "PTSD Support", "Emotional Healing", "Loss & Bereavement", "Crisis Intervention"]
    },
    {
      title: "Psychotherapy",
      slug: "psychotherapy",
      desc: "Our psychotherapy services utilize proven therapeutic approaches including CBT, DBT, and mindfulness-based interventions.",
      icon: <Brain className="w-8 h-8 text-teal-600" />,
      includes: ["Cognitive Behavioral Therapy (CBT)", "Dialectical Behavior Therapy (DBT)", "Mindfulness-Based Therapy", "Trauma-Informed Care", "Depression & Anxiety Treatment", "Stress Management"]
    },
    {
      title: "Counseling Services",
      slug: "counselling-services",
      desc: "Our counseling services address relationship dynamics, family conflicts, and communication patterns for individuals and groups.",
      icon: <MessageCircle className="w-8 h-8 text-teal-600" />,
      includes: ["Individual Counseling", "Couples Therapy", "Family Counseling", "Group Sessions", "Relationship Issues", "Communication Skills"]
    }
  ],
  blogs: [
    {
      title: "Understanding Anxiety",
      subtitle: "A Guide to Finding Peace",
      date: "May 15, 2026",
      image: SITE_ASSETS.SERVICES_LANDING.blogs[0].src
    },
    {
      title: "The Power of Mindfulness",
      subtitle: "In Healing Trauma",
      date: "May 10, 2026",
      image: SITE_ASSETS.SERVICES_LANDING.blogs[1].src
    },
    {
      title: "Building Healthy Relationships",
      subtitle: "Communication Tips",
      date: "May 05, 2026",
      image: SITE_ASSETS.SERVICES_LANDING.blogs[2].src
    }
  ]
};

export default function V2Service() {
  return (
    <div className="space-y-24 md:space-y-32 pb-32 pt-10">
      
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 md:space-y-8"
        >
          <div className="flex items-center gap-2 text-teal-600 font-bold tracking-widest text-xs uppercase">
            <span>Home</span>
            <ChevronRight size={14} />
            <span className="opacity-60">Services</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-slate-900 leading-tight">
            {SERVICE_PAGE_CONTENT.hero.title}
          </h1>
          <p className="text-lg md:text-xl text-slate-500 leading-relaxed font-medium">
            {SERVICE_PAGE_CONTENT.hero.description}
          </p>
          <div className="pt-4">
            <Link href="/v2/book_appointment">
              <button className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-sm hover:bg-teal-600 transition-all flex items-center gap-2 group shadow-xl shadow-slate-100">
                BOOK YOUR SESSION
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
          <div className="relative aspect-[4/5] md:aspect-square w-full max-w-[500px] mx-auto lg:ml-auto rounded-t-full rounded-b-[3rem] overflow-hidden shadow-2xl bg-slate-100 flex items-center justify-center">
             {SERVICE_PAGE_CONTENT.hero.image ? (
               <Image 
                  src={SERVICE_PAGE_CONTENT.hero.image}
                  alt="APCAMS Therapy Room"
                  fill
                  className="object-cover"
                  priority
               />
             ) : (
               <span className="text-slate-400 font-bold p-8 text-center uppercase tracking-widest text-sm">APCAMS Therapy Room</span>
             )}
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-slate-100 rounded-full -z-10"></div>
        </motion.div>
      </section>

      {/* 2. SERVICES DETAIL GRID */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {SERVICE_PAGE_CONTENT.services.map((service, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              key={i} 
              className="group bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-12 hover:shadow-2xl hover:shadow-slate-100 transition-all duration-500 flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center border border-teal-100 group-hover:scale-110 transition-transform duration-500">
                  {service.icon}
                </div>
                <div className="text-slate-200 text-5xl font-bold tracking-tighter opacity-20 group-hover:opacity-10 transition-opacity">
                  {i + 1 < 10 ? `0${i + 1}` : i + 1}
                </div>
              </div>
              
              <div className="space-y-6 flex-grow">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900">{service.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  {service.desc}
                </p>
                
                <div className="pt-6 border-t border-slate-50">
                  <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-4">Includes</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.includes.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                        <CheckCircle2 size={16} className="text-teal-500 shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-10">
                <Link 
                  href={`/v2/service/${service.slug}`}
                  className="flex items-center gap-2 text-slate-900 font-bold text-sm group/btn w-fit"
                >
                  LEARN MORE 
                  <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center transition-all duration-300 group-hover/btn:bg-slate-900 group-hover/btn:border-slate-900 group-hover/btn:text-white">
                    <ArrowUpRight size={16} />
                  </div>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. OUR PROCESS (JOURNEY PATH) */}
      <section className="bg-slate-50 py-24 md:py-32 relative overflow-hidden">
        {/* Background Text Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.03] whitespace-nowrap">
          <span className="text-[20vw] font-bold text-slate-900 leading-none">THE JOURNEY</span>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center space-y-6 mb-20 md:mb-32">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100/50 text-teal-700 rounded-full text-xs font-bold tracking-widest uppercase">
              <Zap size={14} className="animate-pulse" />
              Path of Transformation
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">Our Healing Process</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg md:text-xl font-medium">
              We follow a structured four-phase evolutionary path, guiding you from psychological safety to sustained resilience.
            </p>
          </div>

          <div className="relative">
            {/* Visual Flow Line (Desktop) - Adjusted to span between centers of blocks */}
            <div className="hidden lg:block absolute top-[56px] left-[5.5%] w-[75%] h-1 bg-slate-200/50 z-0">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                viewport={{ once: true }}
                className="h-full bg-teal-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
              {[
                {
                  id: "01",
                  title: "The Container",
                  subtitle: "Safety & Neuroplasticity",
                  desc: "Creating a clinical space of unconditional positive regard where your nervous system can move out of survival mode.",
                  icon: <ShieldCheck className="w-6 h-6" />,
                  color: "bg-teal-500"
                },
                {
                  id: "02",
                  title: "The Blueprint",
                  subtitle: "Strength-Based Strategy",
                  desc: "Co-creating a tailored assessment focusing on 'What is right with you' using your unique internal resources.",
                  icon: <Target className="w-6 h-6" />,
                  color: "bg-teal-600"
                },
                {
                  id: "03",
                  title: "The Work",
                  subtitle: "4D Integration",
                  desc: "Active integration across Cognitive, Somatic, Emotional, and Spiritual dimensions for holistic healing.",
                  icon: <Sparkles className="w-6 h-6" />,
                  color: "bg-slate-800"
                },
                {
                  id: "04",
                  title: "The Growth",
                  subtitle: "Sustained Resilience",
                  desc: "Ongoing support ensuring tools for resilience are integrated into your daily life for long-term well-being.",
                  icon: <Zap className="w-6 h-6" />,
                  color: "bg-slate-900"
                }
              ].map((step, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2, duration: 0.6 }}
                  viewport={{ once: true }}
                  key={i} 
                  className="relative space-y-8 group"
                >
                  {/* Step Marker */}
                  <div className="relative z-10 flex flex-col items-center lg:items-start">
                    <div className={`w-28 h-28 rounded-[2rem] ${step.color} flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-500 group-hover:rotate-6`}>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-3xl font-bold">{step.id}</span>
                        <div className="opacity-60">{step.icon}</div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center lg:text-left space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-1">{step.subtitle}</h4>
                      <h3 className="text-2xl font-bold text-slate-900">{step.title}</h3>
                    </div>
                    <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* 24/7 Support Banner */}
        <div className="max-w-4xl mx-auto px-6 mt-32 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-red-100 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-red-500/5"
          >
            <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center text-white shrink-0 animate-pulse">
              <ShieldAlert size={28} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-slate-900 font-bold text-xl mb-2 flex items-center justify-center md:justify-start gap-2">
                24/7 Crisis Support
                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] uppercase tracking-widest rounded-md">Immediate Help</span>
              </h4>
              <p className="text-slate-500 text-sm font-medium">APCAMS is committed to providing 24/7 suicide prevention support. If you are in immediate distress, please reach out.</p>
            </div>
            <button className="px-8 py-4 bg-red-500 text-white rounded-full font-bold text-sm hover:bg-red-600 transition-all">
              GET HELP NOW
            </button>
          </motion.div>
        </div>
      </section>

      {/* 4. LATEST BLOGS */}
      <section className="max-w-7xl mx-auto px-6 space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-4">
            <div className="text-teal-600 font-bold tracking-widest uppercase text-xs">Insights</div>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">Latest Blogs</h2>
          </div>
          <button className="px-6 py-3 border border-slate-200 rounded-full font-bold text-sm hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all">
            VIEW ALL POSTS
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICE_PAGE_CONTENT.blogs.map((post, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              key={i} 
              className="group cursor-pointer"
            >
              <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-6 shadow-lg bg-slate-100 flex items-center justify-center">
                {post.image ? (
                  <Image 
                    src={post.image} 
                    alt={post.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <span className="text-slate-400 font-bold text-center p-4 uppercase tracking-widest text-xs">{post.title}</span>
                )}
                <div className="absolute top-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full flex items-center gap-2 shadow-sm">
                  <Clock size={14} className="text-teal-600" />
                  <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">{post.date}</span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors">{post.title}</h3>
                <p className="text-slate-500 font-medium">{post.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-teal-600 rounded-[3rem] p-8 md:p-20 relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="space-y-6 text-center lg:text-left max-w-2xl">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[2rem] flex items-center justify-center border border-white/20 mx-auto lg:mx-0">
                <CalendarDays className="text-white w-10 h-10" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                Ready to Begin Your Healing Journey?
              </h2>
              <p className="text-teal-50 text-lg md:text-xl font-medium opacity-90">
                Schedule your initial consultation and take the first step toward transformation.
              </p>
            </div>

            <button className="px-8 py-5 md:px-12 md:py-6 bg-slate-900 text-white rounded-full font-bold text-sm md:text-lg hover:bg-white hover:text-teal-600 transition-all shadow-xl flex items-center gap-3 group/btn">
              SCHEDULE A CONSULTATION
              <ArrowUpRight size={22} className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
