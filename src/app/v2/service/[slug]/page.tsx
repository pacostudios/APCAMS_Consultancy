"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  ArrowUpRight, 
  Brain, 
  Heart, 
  Compass, 
  Target, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2,
  Activity,
  Zap,
  ShieldAlert
} from "lucide-react";

import { SITE_ASSETS } from "@/lib/site-assets";

// Service Data Mapping
const serviceData: Record<string, any> = {
  "psychotherapy": {
    title: "Psychotherapy",
    tagline: "Science-Backed Clinical Healing",
    description: "Our psychotherapy services utilize proven therapeutic approaches to help you navigate complex mental health challenges and develop healthy coping strategies.",
    image: SITE_ASSETS.SERVICE_DETAILS.psychotherapy.hero, 
    icon: <Brain className="w-12 h-12" />,
    dimensions: [
      { name: "Cognitive", focus: "Thoughts, beliefs, and narratives.", method: "CBT & Talk Therapy" },
      { name: "Somatic", focus: "The body and nervous system.", method: "Somatic Regulation" },
      { name: "Emotional", focus: "Feelings and relational patterns.", method: "Emotional Literacy" },
      { name: "Spiritual", focus: "Purpose and soul connection.", method: "Existential Alignment" }
    ],
    includes: [
      "Cognitive Behavioral Therapy (CBT)",
      "Dialectical Behavior Therapy (DBT)",
      "Trauma-Informed Care",
      "Depression & Anxiety Treatment",
      "Stress Management",
      "Neuroplasticity Training"
    ],
    emergencySupport: true
  },
  "counselling-services": {
    title: "Counseling Services",
    tagline: "Compassionate Relational Guidance",
    description: "Deep listening and empathy-driven support for individuals, couples, and families to address communication patterns and systemic harmony.",
    image: SITE_ASSETS.SERVICE_DETAILS.counsellingServices.hero,
    icon: <Heart className="w-12 h-12" />,
    dimensions: [
      { name: "Relational", focus: "Communication and boundaries.", method: "Systemic Therapy" },
      { name: "Behavioral", focus: "Habits and reactions.", method: "Action-Oriented Planning" },
      { name: "Contextual", focus: "Social and cultural environment.", method: "CALD Specialized Care" },
      { name: "Empathetic", focus: "Unconditional positive regard.", method: "Person-Centered Support" }
    ],
    includes: [
      "Individual Counseling",
      "Couples Therapy",
      "Family Counseling",
      "Communication Skills Training",
      "Gottman Method Principles",
      "Intergenerational Healing"
    ]
  },
  "meditation-programs": {
    title: "Meditation Programs",
    tagline: "Mindful Resilience & Inner Peace",
    description: "Cultivate presence and reduce stress through guided mindfulness training, breathwork, and transformative wellness retreats.",
    image: SITE_ASSETS.SERVICE_DETAILS.meditationPrograms.hero,
    icon: <Compass className="w-12 h-12" />,
    dimensions: [
      { name: "Mind", focus: "Mental clarity and focus.", method: "Mindfulness Training" },
      { name: "Body", focus: "Breath and physical stillness.", method: "Vipassana Techniques" },
      { name: "Soul", focus: "Transcendence and peace.", method: "Guided Visualization" },
      { name: "Energy", focus: "Vibrational and nervous system balance.", method: "Breathwork (Pranayama)" }
    ],
    includes: [
      "Guided Meditation Sessions",
      "Mindfulness-Based Stress Reduction",
      "Wellness Retreats",
      "Breathwork Workshops",
      "Body Awareness Practices",
      "Daily Practice Integration"
    ]
  },
  "personal-growth": {
    title: "Personal Growth",
    tagline: "Evolve Beyond Your Limitations",
    description: "Shift from 'What is wrong?' to 'What is right?'. Our growth programs use your internal resources to drive your evolution.",
    image: SITE_ASSETS.SERVICE_DETAILS.personalGrowth.hero,
    icon: <Target className="w-12 h-12" />,
    dimensions: [
      { name: "Vision", focus: "Future goals and aspirations.", method: "Strategic Life Coaching" },
      { name: "Agency", focus: "Self-efficacy and empowerment.", method: "Strength-Based Blueprint" },
      { name: "Identity", focus: "Authentic self-expression.", method: "Self-Discovery Workshops" },
      { name: "Performance", focus: "Confidence and public presence.", method: "Peak Performance Tools" }
    ],
    includes: [
      "Life Coaching",
      "Goal Setting & Achievement",
      "Confidence Building",
      "Career Guidance",
      "Self-Discovery Sessions",
      "Leadership Development"
    ]
  },
  "addiction-support": {
    title: "Addiction Support",
    tagline: "Sustainable Path to Recovery",
    description: "Evidence-based treatment for substance abuse and behavioral addictions, focusing on reclaiming your agency and rebuilding your life.",
    image: SITE_ASSETS.SERVICE_DETAILS.addictionSupport.hero,
    icon: <ShieldCheck className="w-12 h-12" />,
    dimensions: [
      { name: "Physical", focus: "Detox and somatic stability.", method: "Recovery Planning" },
      { name: "Psychological", focus: "Trigger management.", method: "Relapse Prevention" },
      { name: "Social", focus: "Community and support.", method: "Group Sessions" },
      { name: "Existential", focus: "Finding meaning beyond addiction.", method: "Spiritual Care" }
    ],
    includes: [
      "Addiction Assessment",
      "Relapse Prevention Strategies",
      "Support Groups",
      "Family Support Systems",
      "Ongoing Monitoring",
      "Holistic Recovery Tools"
    ],
    emergencySupport: true
  },
  "healing-recovery": {
    title: "Healing & Recovery",
    tagline: "Processing Grief & Trauma",
    description: "Compassionate support for grief, trauma, and PTSD using trauma-informed care to process difficult experiences and build resilience.",
    image: SITE_ASSETS.SERVICE_DETAILS.healingRecovery.hero,
    icon: <Sparkles className="w-12 h-12" />,
    dimensions: [
      { name: "Trauma", focus: "Processing difficult memories.", method: "Trauma-Informed Therapy" },
      { name: "Grief", focus: "Honoring loss and transition.", method: "Bereavement Counseling" },
      { name: "Resilience", focus: "Rebuilding inner strength.", method: "Healing Support" },
      { name: "Hope", focus: "Future outlook and meaning.", method: "Spiritual Integration" }
    ],
    includes: [
      "Grief Counseling",
      "Trauma-Informed Care",
      "PTSD Support",
      "Loss & Bereavement",
      "Crisis Intervention",
      "Somatic Healing"
    ],
    emergencySupport: true
  }
};

export default function ServiceDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const data = serviceData[slug as string];

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
        <button 
          onClick={() => router.push("/v2/service")}
          className="px-6 py-2 bg-slate-900 text-white rounded-full font-bold"
        >
          Back to Services
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-20 md:space-y-32 pb-32">
      {/* Hero Section - Solid Navbar adjustment */}
      <section className="relative min-h-[60vh] flex items-center bg-slate-900 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          {data.image ? (
            <Image 
              src={data.image} 
              alt={data.title} 
              fill 
              className="object-cover brightness-[0.45]"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-slate-700 font-bold text-4xl md:text-6xl uppercase tracking-[0.2em] opacity-50">{data.title}</span>
            </div>
          )}
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl space-y-6"
          >
            <button 
              onClick={() => router.push("/v2/service")}
              className="flex items-center gap-2 text-teal-400 font-bold tracking-widest text-xs uppercase mb-8 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Services
            </button>
            <div className="text-teal-400 font-bold tracking-[0.2em] uppercase text-xs md:text-sm">
              {data.tagline}
            </div>
            <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tight leading-tight">
              {data.title}
            </h1>
            <p className="text-lg md:text-2xl text-slate-200 leading-relaxed font-medium max-w-2xl">
              {data.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 4-Dimensional Integration */}
      <section className="max-w-7xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-4">
          <div className="text-teal-600 font-bold tracking-[0.2em] uppercase text-xs">The Alchemy Framework</div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">Four-Dimensional Integration</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg">
            We address the whole person by bridging distinct yet overlapping dimensions of your identity and experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.dimensions.map((dim: any, i: number) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              key={i} 
              className="bg-white border border-slate-100 rounded-[2rem] p-8 space-y-6 hover:shadow-xl transition-all group"
            >
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all">
                <Activity size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">{dim.name}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{dim.focus}</p>
              </div>
              <div className="pt-4 border-t border-slate-50">
                <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-1">Integration Method</p>
                <p className="text-sm font-bold text-slate-700">{dim.method}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main Content & Includes */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-8">
          <div className="bg-teal-50/50 rounded-[2.5rem] p-10 md:p-12 space-y-8">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Zap className="text-teal-600" />
              What to Expect
            </h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              In our {data.title} sessions, we create a safe, non-judgmental environment. Our multi-disciplinary background spans psychology, culture, and spirituality, ensuring a grounded and respectful space for your transformation.
            </p>
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900">Key Focus Areas:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.includes.map((item: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-slate-600 font-semibold">
                    <CheckCircle2 size={18} className="text-teal-600 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-12 sticky top-32">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 md:p-12 text-white space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                {data.icon}
              </div>
              <h3 className="text-3xl font-bold tracking-tight">Ready to begin your journey?</h3>
              <p className="text-slate-400 font-medium">
                Book a confidential consultation today. Our practitioner sees the "whole person" rather than just a diagnosis.
              </p>
              <Link href={`/v2/book_appointment?service=${slug}`} className="block w-full">
                <button className="w-full py-4 bg-teal-600 text-white rounded-full font-bold hover:bg-white hover:text-teal-600 transition-all flex items-center justify-center gap-2 group/btn shadow-xl shadow-teal-900/20">
                  BOOK YOUR SESSION
                  <ArrowUpRight size={20} className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                </button>
              </Link>
            </div>
          </div>

          {data.emergencySupport && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
              <div className="p-2 bg-red-100 rounded-lg text-red-600 shrink-0">
                <ShieldAlert size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-red-900 text-sm">24/7 Crisis Support</h4>
                <p className="text-xs text-red-700 leading-relaxed font-medium">
                  We are committed to providing 24/7 suicide prevention support. If you are in immediate danger, please contact local emergency services or our hotline.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
