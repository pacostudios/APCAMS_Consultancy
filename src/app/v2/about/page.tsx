"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
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
  Users,
  User,
  Compass,
  Brain,
  Activity,
  Network
} from "lucide-react";
import { SITE_ASSETS } from "@/lib/site-assets";

export default function V2About() {
  const dimensionsOfConnection = [
    {
      title: "Connection to Yourself",
      desc: "Understanding your inner world and uncovering your true voice.",
      icon: <User className="w-6 h-6" />
    },
    {
      title: "Connection to Others",
      desc: "Building healthier relationships and resolving conflict with empathy.",
      icon: <Users className="w-6 h-6" />
    },
    {
      title: "Connection to Nature",
      desc: "Grounding your healing journey in the world around you.",
      icon: <Leaf className="w-6 h-6" />
    },
    {
      title: "Connection to a Higher Reality",
      desc: "Engaging with the broader energy, power, or purpose that gives life meaning.",
      icon: <Compass className="w-6 h-6" />
    }
  ];

  const frameworkPillars = [
    {
      number: "1",
      title: "Biological (The Body / The Soma)",
      desc: "We honour the nervous system. Mental health is deeply connected to physiological well-being, trauma storage in the body, and neurodiversity (such as ADHD). Our practice incorporates somatic awareness, breathwork, and nervous system regulation to calm the physical manifestations of anxiety, stress, and trauma.",
      icon: <Activity className="w-7 h-7 text-teal-600" />
    },
    {
      number: "2",
      title: "Psychological (The Mind / The Psyche)",
      desc: "We utilize rigorous, evidence-based modern psychology. Drawing from modalities like Cognitive Behavioural Therapy (CBT), Dialectical Behavioural Therapy (DBT), and mindfulness-based interventions, we provide practical cognitive tools to break negative thought patterns, build emotional resilience, and process deep-seated wounds.",
      icon: <Brain className="w-7 h-7 text-teal-600" />
    },
    {
      number: "3",
      title: "Social (The System)",
      desc: "Humans do not exist in a vacuum. We are profoundly shaped by our families, cultures, relationships, and societal structures. Whether we are navigating family conflict through Family Dispute Resolution (FDR) or working with couples, our philosophy emphasizes restoring healthy boundaries, improving communication, and breaking generational cycles of trauma.",
      icon: <Network className="w-7 h-7 text-teal-600" />
    },
    {
      number: "4",
      title: "Spiritual (The Essence / The Soul)",
      desc: "We respect and welcome your inner world, regardless of your background. Spirituality to us is broad and inclusive—it encompasses your core values, your search for meaning, existential exploration, and your connection to something larger than yourself. We provide a space where your cultural, spiritual, and linguistic heritage is not just tolerated, but deeply honoured as a source of strength and vitality.",
      icon: <Sparkles className="w-7 h-7 text-teal-600" />
    }
  ];

  const values = [
    {
      label: "Curious Compassion",
      desc: "Approaching every individual's unique story with deep empathy and an open, non-judgmental desire to understand.",
      icon: <HeartHandshake className="w-8 h-8 text-teal-700" />
    },
    {
      label: "Commitment & Dedication",
      desc: "Showing unwavering support and presence throughout your entire journey of healing and transformation.",
      icon: <Lightbulb className="w-8 h-8 text-teal-700" />
    },
    {
      label: "Authenticity in Everything",
      desc: "Fostering an environment built on genuine connection, honesty, and transparent care.",
      icon: <Sparkles className="w-8 h-8 text-teal-700" />
    },
    {
      label: "Driving for Excellence",
      desc: "Combining evidence-based therapeutic science with high-quality holistic practices to deliver the best possible care.",
      icon: <Star className="w-8 h-8 text-teal-700" />
    },
    {
      label: "Unconditional Positive Regard",
      desc: "Providing complete acceptance and support, ensuring you always feel safe, respected, and valued exactly as you are.",
      icon: <Users className="w-8 h-8 text-teal-700" />
    },
    {
      label: "Unconditional Love",
      desc: "The ultimate foundation of our practice, bringing deep compassion and warmth to the healing process.",
      icon: <Award className="w-8 h-8 text-teal-700" />
    },
  ];

  return (
    <div className="space-y-24 md:space-y-32 pb-32 pt-28 md:pt-36">
      
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
            ABOUT APCAMS
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
            Healing Through <br className="hidden md:block" /> Integrated Care
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed font-medium">
            We are a multidisciplinary holistic psychotherapy and counselling practice led by a PACFA (Psychotherapy and Counselling Federation of Australia) - credentialed Clinical Psychotherapist and accredited Family Dispute Resolution Practitioner (FDRP), with over 12 years of professional experience. We provide individual, couples, and family therapy while also providing family mediation services, supporting clients and families from diverse cultural, spiritual, and linguistic backgrounds. Our approach blends evidence-based psychology with holistic and integrative care (Bio-psycho-socio-spiritual), creating a safe, respectful, and non-judgmental space that supports healing, connection, and wholeness.
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
      <section id="philosophy" className="max-w-7xl mx-auto px-6 space-y-20 md:space-y-28">
        {/* Header Block */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="text-teal-600 font-bold tracking-widest uppercase text-xs md:text-sm">Our Philosophy</div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight font-outfit">
            The Alchemy of Healing
          </h2>
          <div className="flex items-center justify-center gap-4 text-teal-200">
            <div className="h-px w-12 bg-slate-200"></div>
            <Leaf size={20} className="text-teal-600" />
            <div className="h-px w-12 bg-slate-200"></div>
          </div>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed font-medium">
            At Alchemy Psychotherapy, Counselling, and Mediation Services (APCAMS), we believe that true healing goes far beyond the reduction of symptoms. It is a profound journey toward wholeness, self-discovery, and reclaiming your inherent worth.
          </p>
        </div>

        {/* Four Dimensions of Connection */}
        <div className="space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 font-outfit">Four Dimensions of Connection</h3>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
              Real transformation occurs when we stop viewing challenges in isolation and begin honouring the entire ecosystem of who you are. We guide you in cultivating connection:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dimensionsOfConnection.map((dim, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                key={i}
                className="bg-white border border-slate-100 rounded-[2rem] p-8 space-y-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-teal-50/50 rounded-xl flex items-center justify-center border border-teal-100 text-teal-600">
                    {dim.icon}
                  </div>
                  <h4 className="font-bold text-slate-950 text-lg leading-tight font-outfit">{dim.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">{dim.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* The Bio-Psycho-Socio-Spiritual Framework */}
        <div className="space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 font-outfit">The Bio-Psycho-Socio-Spiritual Framework</h3>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
              We practice through an integrative lens that recognizes four essential dimensions of the human experience. Your care is personalized by exploring how these pillars intertwine:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {frameworkPillars.map((pillar, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                key={i}
                className="bg-slate-50/50 border border-slate-100/80 rounded-[2.5rem] p-8 md:p-10 flex gap-6 hover:bg-white hover:shadow-xl hover:border-teal-50 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-slate-100 text-teal-600">
                  {pillar.icon}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">{pillar.number}</span>
                    <h4 className="font-bold text-slate-950 text-xl leading-tight font-outfit">{pillar.title}</h4>
                  </div>
                  <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">
                    {pillar.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sanctuary and Collaborative Approach Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-teal-600 rounded-[2rem] md:rounded-[3rem] p-8 md:p-14 relative shadow-xl overflow-hidden group text-white"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
            <div className="lg:col-span-3 space-y-4">
              <span className="text-teal-100 font-bold uppercase tracking-widest text-xs">Collaborative Sanctuary</span>
              <p className="text-xl md:text-2xl font-serif italic text-teal-50 leading-relaxed">
                &quot;The first step towards healing is understanding.&quot;
              </p>
              <p className="text-sm md:text-base text-teal-50 leading-relaxed opacity-95">
                We do not offer one-size-fits-all solutions. Our philosophy is rooted in collaboration; we walk alongside you as a guide, helping you discover your own path to healing and empowering you to make lasting, positive changes.
              </p>
            </div>
            
            <div className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 space-y-4">
              <h4 className="font-bold text-lg text-white font-outfit">A Safe, Non-Judgmental Sanctuary</h4>
              <p className="text-xs md:text-sm text-teal-50 leading-relaxed opacity-90">
                Anxiety, conflict, and shame thrive in isolation. Our core commitment is to provide a space that feels genuinely safe, respectful, and free of judgment. Guided by over 12 years of experience, we blend clinical authority with authentic warmth.
              </p>
              <div className="pt-2">
                <Link href="/v2/book_appointment">
                  <button className="w-full py-3 bg-white text-teal-700 rounded-full font-bold text-xs md:text-sm hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2 group/btn">
                    BEGIN YOUR JOURNEY FORWARD
                    <ArrowUpRight size={16} className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
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

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-4 divide-y md:divide-y-0 divide-slate-200/50">
              {values.map((value, i) => (
                <div key={i} className="flex flex-col items-center justify-center text-center space-y-4 pt-8 md:pt-0 first:pt-0 md:first:pt-0">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                    {value.icon}
                  </div>
                  <span className="font-bold text-slate-900">{value.label}</span>
                  <p className="text-sm text-slate-500 leading-relaxed">{value.desc}</p>
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
              <p className="text-sm text-slate-400 font-medium leading-relaxed">
                B.Ph. &middot; B.A (English) &middot; LL.B &middot; Cert CPE &middot; Master of Criminal Justice (MCJ) &middot; M.A (Theology) &middot; Master of Psychotherapy &amp; Counselling &middot; Grad Dip. in Family Law (FDRP)
              </p>
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

        {/* Detailed Credentials, Accreditations & Specializations */}
        <div className="mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Column 1: Credentials & Education */}
          <div className="bg-white border border-slate-100 rounded-[2rem] p-8 md:p-10 shadow-lg shadow-slate-100/30 flex flex-col space-y-6">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-3 border-b border-slate-50 pb-4 font-outfit">
              <GraduationCap className="text-teal-600 w-5 h-5 shrink-0" />
              Credentials & Education
            </h3>
            <ul className="space-y-3.5 flex-grow">
              {[
                "Master of Psychotherapy & Counselling",
                "Grad Dip. in Family Law (Family Dispute Resolution Practitioner - FDRP)",
                "Master of Criminal Justice (MCJ)",
                "M.A. in Theology",
                "LL.B. (Bachelor of Laws)",
                "B.A. in English",
                "B.Ph. (Bachelor of Philosophy)",
                "Cert CPE (Clinical Pastoral Education)"
              ].map((degree, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 font-medium leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0"></div>
                  <span>{degree}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Professional Accreditations */}
          <div className="bg-white border border-slate-100 rounded-[2rem] p-8 md:p-10 shadow-lg shadow-slate-100/30 flex flex-col space-y-6">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-3 border-b border-slate-50 pb-4 font-outfit">
              <Award className="text-teal-600 w-5 h-5 shrink-0" />
              Professional Accreditations
            </h3>
            <div className="space-y-6 flex-grow">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-950 text-sm md:text-base flex items-center gap-2 font-outfit">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                  Clinical Psychotherapist
                </h4>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed pl-3.5 font-medium">
                  Credentialed with the Psychotherapy and Counselling Federation of Australia (PACFA).
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-950 text-sm md:text-base flex items-center gap-2 font-outfit">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                  Accredited FDRP
                </h4>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed pl-3.5 font-medium">
                  Certified Family Dispute Resolution Practitioner, qualified to provide family mediation and dispute resolution services.
                </p>
              </div>
            </div>
          </div>

          {/* Column 3: Areas of Specialization */}
          <div className="bg-white border border-slate-100 rounded-[2rem] p-8 md:p-10 shadow-lg shadow-slate-100/30 flex flex-col space-y-6">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-3 border-b border-slate-50 pb-4 font-outfit">
              <Sparkles className="text-teal-600 w-5 h-5 shrink-0" />
              Specialization & Approach
            </h3>
            <div className="grid grid-cols-1 gap-5 flex-grow">
              {[
                { title: "Diverse Clientele", desc: "Specializes in working with individuals, couples, and families from a wide range of cultural, spiritual, and linguistic backgrounds." },
                { title: "Spiritually Integrative Care", desc: "Blends psychological frameworks with a spiritually inclusive perspective to support holistic healing." },
                { title: "Clinical Focus", desc: "Focuses on guiding clients through trauma, anxiety, and complex interpersonal or familial relationship dynamics." },
                { title: "Therapeutic Environment", desc: "Emphasizes building a safe, unbiased, and deeply respectful space for authentic healing." }
              ].map((spec, i) => (
                <div key={i} className="space-y-1">
                  <h4 className="font-bold text-slate-950 text-xs md:text-sm flex items-center gap-2 font-outfit">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                    {spec.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed pl-3.5 font-medium">
                    {spec.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
