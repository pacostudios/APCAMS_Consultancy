"use client";

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
  Clock
} from "lucide-react";

export default function V2Service() {
  const serviceCategories = [
    {
      title: "Personal Growth",
      desc: "Our personal growth programs combine therapeutic insights with life coaching strategies to help you identify your values, set meaningful goals, and create the life you envision.",
      icon: <Target className="w-8 h-8 text-teal-600" />,
      includes: ["Life Coaching", "Goal Setting & Achievement", "Self-Discovery Sessions", "Confidence Building", "Career Guidance", "Personal Development"]
    },
    {
      title: "Addiction Support",
      desc: "Our addiction support services provide evidence-based treatment for substance abuse and behavioral addictions with a focus on long-term recovery.",
      icon: <ShieldCheck className="w-8 h-8 text-teal-600" />,
      includes: ["Addiction Assessment", "Recovery Planning", "Relapse Prevention", "Support Groups", "Family Support", "Ongoing Monitoring"]
    },
    {
      title: "Meditation & Mindfulness",
      desc: "Learn the transformative power of mindfulness through our structured meditation programs designed for stress reduction and emotional balance.",
      icon: <Leaf className="w-8 h-8 text-teal-600" />,
      includes: ["Guided Meditation Sessions", "Mindfulness Training", "Stress Reduction Programs", "Wellness Retreats", "Breathwork Techniques", "Daily Practice Support"]
    },
    {
      title: "Healing & Recovery",
      desc: "Our healing and recovery programs provide compassionate support for those experiencing grief, trauma, or emotional distress.",
      icon: <Sparkles className="w-8 h-8 text-teal-600" />,
      includes: ["Grief Counseling", "Trauma Recovery", "PTSD Support", "Emotional Healing", "Loss & Bereavement", "Crisis Intervention"]
    },
    {
      title: "Psychotherapy",
      desc: "Our psychotherapy services utilize proven therapeutic approaches including CBT, DBT, and mindfulness-based interventions.",
      icon: <Brain className="w-8 h-8 text-teal-600" />,
      includes: ["Cognitive Behavioral Therapy (CBT)", "Dialectical Behavior Therapy (DBT)", "Mindfulness-Based Therapy", "Trauma-Informed Care", "Depression & Anxiety Treatment", "Stress Management"]
    },
    {
      title: "Counseling Services",
      desc: "Our counseling services address relationship dynamics, family conflicts, and communication patterns for individuals and groups.",
      icon: <MessageCircle className="w-8 h-8 text-teal-600" />,
      includes: ["Individual Counseling", "Couples Therapy", "Family Counseling", "Group Sessions", "Relationship Issues", "Communication Skills"]
    }
  ];

  const processSteps = [
    {
      id: "01",
      title: "Initial Consultation",
      desc: "Comprehensive assessment to understand your unique needs and goals."
    },
    {
      id: "02",
      title: "Personalized Plan",
      desc: "Tailored treatment plan aligning with your objectives and preferences."
    },
    {
      id: "03",
      title: "Active Sessions",
      desc: "Regular meetings and skill-building exercises focused on growth."
    },
    {
      id: "04",
      title: "Ongoing Support",
      desc: "Continuous guidance and plan adjustments throughout your journey."
    }
  ];

  const blogPosts = [
    {
      title: "Understanding Anxiety",
      subtitle: "A Guide to Finding Peace",
      date: "May 15, 2026",
      image: "https://images.unsplash.com/photo-1474418397713-7ded61d96e18?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "The Power of Mindfulness",
      subtitle: "In Healing Trauma",
      date: "May 10, 2026",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Building Healthy Relationships",
      subtitle: "Communication Tips",
      date: "May 05, 2026",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2953d75?auto=format&fit=crop&q=80&w=800"
    }
  ];

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
            Our Services
          </h1>
          <p className="text-lg md:text-xl text-slate-500 leading-relaxed font-medium">
            Comprehensive healing and wellness services designed to support your unique journey of growth, recovery, and transformation.
          </p>
          <div className="pt-4">
            <button className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-sm hover:bg-teal-600 transition-all flex items-center gap-2 group shadow-xl shadow-slate-100">
              BOOK YOUR SESSION
              <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          {/* Custom shaped image container matching About page style */}
          <div className="relative aspect-[4/5] md:aspect-square w-full max-w-[500px] mx-auto lg:ml-auto rounded-t-full rounded-b-[3rem] overflow-hidden shadow-2xl bg-slate-100">
             <Image 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800"
                alt="Alchemy Therapy Room"
                fill
                className="object-cover"
                priority
             />
          </div>
          {/* Subtle background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-slate-100 rounded-full -z-10"></div>
        </motion.div>
      </section>

      {/* 2. SERVICES DETAIL GRID */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {serviceCategories.map((service, i) => (
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
                <button className="flex items-center gap-2 text-slate-900 font-bold text-sm group/btn">
                  LEARN MORE 
                  <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center transition-all duration-300 group-hover/btn:bg-slate-900 group-hover/btn:border-slate-900 group-hover/btn:text-white">
                    <ArrowUpRight size={16} />
                  </div>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. OUR PROCESS */}
      <section className="bg-slate-900 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 space-y-16 md:space-y-24">
          <div className="text-center space-y-4">
            <div className="text-teal-400 font-bold tracking-[0.2em] uppercase text-xs">Our Workflow</div>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Our Process</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base md:text-lg">
              A structured approach to your healing journey, ensuring support at every step.
            </p>
          </div>

          <div className="relative">
            {/* Connection Line (Desktop) */}
            <div className="hidden lg:block absolute top-12 left-0 w-full h-px bg-slate-800 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
              {processSteps.map((step, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  key={i} 
                  className="space-y-6 text-center lg:text-left"
                >
                  <div className="w-24 h-24 mx-auto lg:mx-0 bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-xl shadow-black/20 group hover:border-teal-500/30 transition-all duration-500">
                    <span className="text-3xl font-bold text-teal-400">{step.id}</span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white">{step.title}</h3>
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
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
          {blogPosts.map((post, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              key={i} 
              className="group cursor-pointer"
            >
              <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-6 shadow-lg">
                <Image 
                  src={post.image} 
                  alt={post.title} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
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
