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
  Brain,
  Activity,
  Network,
  FlaskConical,
  RefreshCcw
} from "lucide-react";
import { SITE_ASSETS } from "@/lib/site-assets";

export default function V2About() {
  const etymology = [
    {
      title: "Alchemy",
      subtitle: "The Clinical Process",
      desc: "In the psychological tradition, alchemy represents the intentional, highly structured process of taking life's heaviest, most disorienting emotional burdens—trauma, grief, and fragmentation—and working through them within a safe, therapeutic container to forge resilience, self-mastery, and psychological integration.",
      icon: <FlaskConical className="w-7 h-7 text-teal-600" />
    },
    {
      title: "Metanoia",
      subtitle: "The Holistic Transformation",
      desc: "It represents a radical turning-around, a change of heart, and a reorientation of one's entire life towards the truth. A profound and fundamental turning point of the mind and heart. Rooted in both classical philosophy and modern depth psychology, it signifies the moment where rigid cognitive patterns dissolve, making space for a renewed worldview, authentic self-discovery, and deep psychospiritual alignment.",
      icon: <RefreshCcw className="w-7 h-7 text-teal-600" />
    }
  ];

  const frameworkPillars = [
    {
      number: "1",
      title: "Biological",
      clinical: "Somatic regulation, nervous system mapping, and the physiological processing of stress and trauma.",
      resonance: "Honouring the body as the physical vessel of lived experience and meaning making.",
      icon: <Activity className="w-7 h-7 text-teal-600" />
    },
    {
      number: "2",
      title: "Psychological",
      clinical: "Evidence-based methodologies including Cognitive Behavioural Therapy (CBT), Acceptance and Commitment Therapy (ACT), and psychodynamic exploration.",
      resonance: "Re-authoring internal narratives and cultivating deep cognitive flexibility and self-compassion.",
      icon: <Brain className="w-7 h-7 text-teal-600" />
    },
    {
      number: "3",
      title: "Social",
      clinical: "Interpersonal effectiveness, systemic family dynamics, and healthy relational boundary-setting.",
      resonance: "Fostering authentic community, empathetic connection, and peaceful dispute resolution.",
      icon: <Network className="w-7 h-7 text-teal-600" />
    },
    {
      number: "4",
      title: "Spiritual",
      clinical: "Existential psychology, meaning-making, and values clarification.",
      resonance: "Respecting individual worldview, transcendent purpose, and deeply held personal beliefs.",
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
            ABOUT US
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
              Alchemetanoia
            </h1>
            <p className="text-base md:text-lg font-bold text-teal-700 leading-snug">
              Alchemy Psychotherapy, Counselling, and Mediation Services
            </p>
          </div>
          <p className="text-lg text-slate-500 leading-relaxed font-medium">
            Welcome to Alchemetanoia, where rigorous, evidence-based clinical science converges with the sacred, transformative art of human healing. Grounded in that philosophy, our practice is built upon a foundational premise: that true, lasting psychological health requires both the precision of modern science and the profound, existential awakening of the human spirit.
          </p>
          <div className="pt-4">
            <Link href="/service">
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
          {/* Image container matches the landscape image ratio so nothing is cropped */}
          <div className="relative aspect-[1024/559] w-full max-w-[640px] mx-auto lg:ml-auto rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl bg-slate-100">
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
            The Etymology of Transformation: Alchemy &amp; Metanoia
          </h2>
          <div className="flex items-center justify-center gap-4 text-teal-200">
            <div className="h-px w-12 bg-slate-200"></div>
            <Leaf size={20} className="text-teal-600" />
            <div className="h-px w-12 bg-slate-200"></div>
          </div>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed font-medium">
            The name Alchemetanoia bridges ancient philosophical tradition with contemporary psychological evolution:
          </p>
        </div>

        {/* Alchemy & Metanoia */}
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {etymology.map((item, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                key={i}
                className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-10 space-y-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-teal-50/50 rounded-2xl flex items-center justify-center shrink-0 border border-teal-100">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-950 text-2xl leading-tight font-outfit">{item.title}</h3>
                    <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">{item.subtitle}</span>
                  </div>
                </div>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto text-center space-y-4">
            <p className="text-base md:text-lg text-slate-600 leading-relaxed font-medium">
              Together, <span className="font-bold text-slate-900">Alchemetanoia</span> captures the exact arc of healing: a psychologically and spiritually informed, soulful journey from suffering to profound personal renewal. It is capturing the essence of existential, Jungian, and transpersonal psychotherapies to describe a deep psychological breakdown and subsequent breakthrough.
            </p>
            <p className="text-lg md:text-xl font-serif italic text-teal-700 leading-relaxed">
              It marks a moment when an old, false identity shatters so a healthier, more integrated self can emerge.
            </p>
          </div>
        </div>

        {/* The Bio-Psycho-Socio-Spiritual Framework */}
        <div className="space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="text-teal-600 font-bold tracking-widest uppercase text-xs md:text-sm">Our Theoretical Foundation</div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 font-outfit">The Bio-Psycho-Socio-Spiritual Framework</h3>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
              We reject rigid, one-size-fits-all modalities. Instead, our clinical work is anchored in a comprehensive, multidimensional framework that honours the whole person with all of their strength and vulnerabilities:
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
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">{pillar.number}</span>
                    <h4 className="font-bold text-slate-950 text-xl leading-tight font-outfit">{pillar.title}</h4>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Scientific &amp; Clinical Focus</span>
                    <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">{pillar.clinical}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Existential &amp; Spiritual Resonance</span>
                    <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">{pillar.resonance}</p>
                  </div>
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
              <span className="text-teal-100 font-bold uppercase tracking-widest text-xs">Why Choose Alchemetanoia?</span>
              <p className="text-xl md:text-2xl font-serif italic text-teal-50 leading-relaxed">
                &quot;We do not merely manage symptoms; we facilitate deep, lasting change.&quot;
              </p>
              <p className="text-sm md:text-base text-teal-50 leading-relaxed opacity-95">
                Whether you are navigating clinical mental health challenges such as anxiety, depression, or ADHD, repairing complex relational fractures within the marriage or relationship, or seeking compassionate mediation to resolve disputes outside the courtroom, our practice provides a confidential, highly professional sanctuary.
              </p>
            </div>

            <div className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 space-y-4">
              <h4 className="font-bold text-lg text-white font-outfit">Clarity, Purpose &amp; Integration</h4>
              <p className="text-xs md:text-sm text-teal-50 leading-relaxed opacity-90">
                By blending empirical psychological rigor with a compassionate reverence for your individual human story, we walk beside you as you reclaim your agency, restore your inner equilibrium, and step forward into a life of clarity, purpose, and integration.
              </p>
              <div className="pt-2">
                <Link href="/book_appointment">
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
