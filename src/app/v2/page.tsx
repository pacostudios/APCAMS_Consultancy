"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { 
  ChevronRight, 
  Plus, 
  Minus, 
  Users, 
  Award, 
  Star, 
  ArrowUpRight,
  Sparkles,
  Heart,
  Compass,
  CalendarDays,
  Quote
} from "lucide-react";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { SITE_ASSETS } from "@/lib/site-assets";

export default function V2Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const testimonials = [
    "Well educated, professional, friendly & responsive to my needs/issues. Such a broad base to help many people with their concerns.",
    "James has been most helpful to me. I was concerned therapy would be a chore and/or hard to relate to. James has allayed those fears and I am getting a lot of help out of talking through issues with him.",
    "James has been nothing but a gentleman. He offers a holistic approach and made me feel very comfortable and respected. I value his experience and take on the issues I presented to him.",
    "James is an excellent therapist, he has great knowledge and experience making him one of the best in his field",
    "I find James highly knowledgeable and understanding.",
    "James is highly professional and was able to diagnose and suggest treatment for the mental health issues. My mental health has improved significantly in the 3 months that I've been in therapy with him.",
    "Your support and guidance has brought back my faith and reminded me that I do have worth and can have boundaries.",
    "I feel very comfortable to open up with James. James listens, offers guidance, explains and asks good questions that lead me to self-reflect.",
    "Chacko is an incredible therapist. I’m extremely grateful for his support. He has helped change my life in a super positive way.",
    "Mr James has helped me tremendously in a span of a couple of months. He has always been patient with me and supportive and has helped me become aware to a lot of problems I didn’t know that I faced.",
    "Very informative and great communicator. Easily able to asses path of conversation and therapy. Seems like a top bloke.",
    "I could share my concern and burden with James without feeling ashamed. I was very teary in my 1st session with him. And he was very patient. I could see that he is genuinely interested in my well-being.",
    "James has a great capacity for empathy and understanding one as an individual.",
    "James is an understanding and friendly therapist. He has a fantastic way of challenging ideas and thoughts but also being very empathetic to your situation. Highly recommended.",
    "I have just begun therapy but it’s going well. Chacko (James) is respectful and uses our time well. He is helping me communicate better with my family and helps me understand my feelings and situation."
  ];


  const stats = [
    { icon: <Users className="text-teal-600" />, value: 500, suffix: "+", label: "Lives Transformed" },
    { icon: <Award className="text-teal-600" />, value: 10, suffix: "+", label: "Years Experience" },
    { icon: <Star className="text-teal-600" />, value: 95, suffix: "%", label: "Client Satisfaction" },
  ];

  const services = [
    {
      id: "01",
      title: "Psychotherapy",
      tagline: "Science-Backed Healing",
      desc: "Individual sessions using evidence-based approaches like CBT, DBT, and mindfulness-based interventions to help you navigate complex mental health challenges.",
      icon: <Sparkles className="w-8 h-8 text-teal-600" />,
      color: "from-teal-50/50 to-white",
      hoverColor: "hover:bg-teal-600"
    },
    {
      id: "02",
      title: "Counseling",
      tagline: "Compassionate Guidance",
      desc: "Comprehensive support tailored for individuals, couples, and families to address relationship dynamics, communication patterns, crisis interventions and various life transitions.",
      icon: <Heart className="w-8 h-8 text-teal-600" />,
      color: "from-slate-50/50 to-white",
      hoverColor: "hover:bg-slate-900"
    },
    {
      id: "03",
      title: "Meditation",
      tagline: "Mindful Resilience",
      desc: "Guided mindfulness training, breathwork, and wellness retreats designed to help you cultivate inner peace, focus, and lasting emotional resilience.",
      icon: <Compass className="w-8 h-8 text-teal-600" />,
      color: "from-teal-50/50 to-white",
      hoverColor: "hover:bg-teal-600"
    }
  ];

  const faqs = [
    {
      id: 1,
      q: "What can I expect during my first therapy or counseling session?",
      a: "In your first session, you’ll have a chance to share your concerns in a safe and confidential space. Your therapist or counselor will work with you to understand your goals and discuss how the process can best support your needs."
    },
    {
      id: 2,
      q: "How do I know if I need therapy or counseling?",
      a: "If you're feeling overwhelmed, stuck, anxious, or are struggling with relationships or life transitions, therapy or counseling can provide valuable support and clarity. You don’t need to have a diagnosis—if something feels off, it’s okay to seek help."
    },
    {
      id: 3,
      q: "What types of meditation do you offer in your programs?",
      a: "Our meditation programs include mindfulness, breathwork, guided visualization, and body awareness techniques. Each session is designed to support mental clarity, stress reduction, and emotional balance."
    },
    {
      id: 4,
      q: "Are your services confidential?",
      a: "Yes, all sessions are completely confidential. Your privacy and trust are essential to the therapeutic process, and we adhere to strict professional and ethical standards."
    },
    {
      id: 5,
      q: "Do you offer online or remote sessions?",
      a: "Yes, we offer both in-person and secure online sessions to ensure you can access support wherever you are. Online sessions are just as effective and convenient for those with busy schedules or limited mobility."
    }
  ];

  return (
    <div className="space-y-20 md:space-y-32 pb-32">
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-6 md:space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-[10px] md:text-xs font-bold tracking-wide">
            <Sparkles size={16} />
            TRANSFORMING LIVES THROUGH INTEGRATED AND HOLISTIC HEALING
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-slate-900 leading-[1.1] md:leading-[0.9]">
            APCAMS
          </h1>
          <h2 className="text-xl md:text-3xl font-medium text-slate-600">
           Alchemy Psychotherapy, Counselling and Mediation Services
          </h2>
          <p className="text-lg md:text-xl text-slate-500 max-w-lg leading-relaxed font-normal">
            Discover your path to healing and growth through personalized therapy, 
            mindful counseling, and transformative meditation practices.
          </p>
          <div className="flex items-center gap-6 pt-4">
            <Link href="/v2/book_appointment">
              <button className="px-6 py-3 md:px-8 md:py-4 bg-slate-900 text-white rounded-full font-bold text-sm md:text-base hover:bg-teal-600 transition-all flex items-center gap-2 group">
                BOOK YOUR SESSION
                <ArrowUpRight size={20} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative mt-8 lg:mt-0"
        >
          <div className="aspect-[4/5] bg-slate-100 rounded-[3rem] md:rounded-[4rem] overflow-hidden relative z-10 shadow-2xl">
             <Image 
                src={SITE_ASSETS.HOME.hero.src}
                alt={SITE_ASSETS.HOME.hero.alt}
                fill
                className="object-cover"
             />
          </div>
          {/* Decorative Elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-100 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-slate-200 rounded-full blur-3xl opacity-60"></div>
        </motion.div>
      </section>

      {/* STATS BAR */}
      <section className="max-w-6xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white border border-slate-100 shadow-xl rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
        >
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 bg-teal-50 rounded-2xl mb-2">{stat.icon}</div>
              <span className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                <NumberTicker value={stat.value} className="text-slate-900" />
                {stat.suffix}
              </span>
              <span className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ABOUT APCAMS SECTION */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative aspect-[4/3] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl order-2 lg:order-1"
        >
          <Image 
            src={SITE_ASSETS.HOME.aboutPreview.src} 
            alt={SITE_ASSETS.HOME.aboutPreview.alt} 
            fill 
            className="object-cover"
          />
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-6 md:space-y-8 order-1 lg:order-2"
        >
          <div className="text-teal-600 font-bold tracking-widest uppercase text-xs md:text-sm">About APCAMS</div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight tracking-tight">
            Find Your Path to Healing, Wholeness, and Transformation
          </h2>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed font-medium">
            We are a dedicated team of licensed therapists providing compassionate psychotherapy, counselling, and
            professional mediation services. Whether you are navigating mental health challenges like depression,
            anxiety, and ADHD, or seeking relationship-building, empowerment, and conflict resolution, we are here
            to support you every step of the way.
          </p>
          <a 
            href="/v2/about" 
            className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-slate-900 text-white rounded-full font-bold text-sm md:text-base hover:bg-teal-600 transition-all group w-fit"
          >
            EXPLORE MORE
            <ArrowUpRight size={20} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
        </motion.div>
      </section>

      {/* SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-6 space-y-12 md:space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">Our Services</h2>
          <p className="text-slate-500 max-w-xl mx-auto text-base md:text-lg">
            Comprehensive healing and wellness services designed to support your unique journey of growth, recovery, and transformation.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, i) => (
            <motion.div 
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                layout: { duration: 0.3, ease: "easeOut" },
                opacity: { delay: i * 0.1 },
                y: { delay: i * 0.1 } 
              }}
              viewport={{ once: true }}
              key={i} 
              className={`group relative p-8 md:p-10 rounded-[2rem] space-y-6 transition-all duration-300 ease-out border border-slate-100 bg-white hover:bg-teal-600 hover:shadow-[0_30px_60px_-15px_rgba(20,184,166,0.3)] cursor-default`}
            >
              <div className="w-14 h-14 md:w-16 md:h-16 bg-white border border-slate-50 rounded-2xl flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110">
                <div className="text-teal-600">
                  {service.icon}
                </div>
              </div>
              <div className="space-y-3 md:space-y-4">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-white">
                  {service.title}
                </h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium transition-colors duration-300 group-hover:text-teal-50">
                  {service.desc}
                </p>
              </div>
              <button className="text-teal-600 font-bold text-xs md:text-sm flex items-center gap-2 group/btn transition-colors duration-300 group-hover:text-white pt-2">
                LEARN MORE 
                <div className="w-8 h-8 rounded-full border border-teal-100 flex items-center justify-center transition-all duration-300 group-hover:border-white/40 group-hover:bg-white/10">
                  <ChevronRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS CAROUSEL */}
      <section className="max-w-7xl mx-auto px-6 py-0">
        <div className="mb-6 md:mb-8 text-center">
          <div className="text-teal-600 font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-4">Client Stories</div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">What Our Clients Say</h2>
        </div>
        
        {/* Container with Mask for fading edges */}
        <div className="relative flex overflow-x-hidden group rounded-[3rem] border border-slate-100 bg-slate-50/50 py-6 md:py-8" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
          {/* First Track */}
          <div className="animate-marquee flex gap-6 md:gap-8 px-3 md:px-4 w-max shrink-0 group-hover:[animation-play-state:paused]">
            {testimonials.map((testimonial, i) => (
              <div 
                key={`t1-${i}`} 
                className="w-[300px] md:w-[400px] bg-white border border-slate-100 rounded-[2rem] p-8 md:p-10 shadow-sm shrink-0 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Quote className="text-teal-600 w-6 h-6 rotate-180" />
                    <span className="text-slate-900 font-bold tracking-wide uppercase text-xs">Client Testimonial</span>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed text-sm md:text-base mb-8 italic">
                    &quot;{testimonial}&quot;
                  </p>
                </div>
                <div className="flex items-center gap-1 mt-auto">
                  {[...Array(5)].map((_, starIndex) => (
                    <Star key={starIndex} className="w-4 h-4 fill-teal-500 text-teal-500" />
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Second Track (Duplicate for seamless loop) */}
          <div className="animate-marquee flex gap-6 md:gap-8 px-3 md:px-4 w-max shrink-0 group-hover:[animation-play-state:paused]" aria-hidden="true">
            {testimonials.map((testimonial, i) => (
              <div 
                key={`t2-${i}`} 
                className="w-[300px] md:w-[400px] bg-white border border-slate-100 rounded-[2rem] p-8 md:p-10 shadow-sm shrink-0 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Quote className="text-teal-600 w-6 h-6 rotate-180" />
                    <span className="text-slate-900 font-bold tracking-wide uppercase text-xs">Client Testimonial</span>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed text-sm md:text-base mb-8 italic">
                    &quot;{testimonial}&quot;
                  </p>
                </div>
                <div className="flex items-center gap-1 mt-auto">
                  {[...Array(5)].map((_, starIndex) => (
                    <Star key={starIndex} className="w-4 h-4 fill-teal-500 text-teal-500" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-7xl mx-auto px-6 pt-0 pb-12 md:pt-4 md:pb-20 min-h-auto lg:min-h-[800px]">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start h-full">
          {/* Left Side: FAQs */}
          <div className="flex-1 w-full space-y-8 md:space-y-12">
            <div className="space-y-4 text-center lg:text-left">
              <div className="text-teal-600 font-bold tracking-[0.2em] uppercase text-xs md:text-sm">Support</div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
              <p className="text-slate-500 text-base md:text-lg lg:text-xl max-w-xl mx-auto lg:mx-0">Real support for real concerns. Find answers to common questions about our therapeutic process.</p>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div 
                  key={faq.id} 
                  className={`border rounded-[1.25rem] md:rounded-[1.5rem] overflow-hidden transition-colors duration-300 ${
                    activeFaq === i ? "border-teal-200 bg-teal-50/30" : "border-slate-100 bg-white"
                  }`}
                >
                  <button 
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full p-5 md:p-8 text-left flex justify-between items-center hover:bg-slate-50/50 transition-colors"
                  >
                    <span className={`text-base md:text-lg lg:text-xl font-bold transition-colors ${
                      activeFaq === i ? "text-teal-800" : "text-slate-900"
                    }`}>
                      {faq.q}
                    </span>
                    <div className={`p-1.5 md:p-2 rounded-full transition-all shrink-0 ml-4 ${
                      activeFaq === i ? "bg-teal-600 text-white rotate-180" : "bg-slate-100 text-slate-400"
                    }`}>
                      {activeFaq === i ? <Minus size={16} className="md:w-[18px] md:h-[18px]" /> : <Plus size={16} className="md:w-[18px] md:h-[18px]" />}
                    </div>
                  </button>
                  {activeFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      transition={{ duration: 0.25, ease: "circOut" }}
                      className="px-5 md:px-8 pb-6 md:pb-8 text-slate-600 text-sm md:text-base lg:text-lg leading-relaxed font-medium"
                    >
                      <div className="pt-4 border-t border-teal-100">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Side: Sticky Image */}
          <div className="hidden lg:block sticky top-32 w-full max-w-[460px] self-start transform-gpu">
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl bg-slate-100">
              <Image 
                src="/table_tea.webp" 
                alt="Frequently Asked Questions" 
                fill 
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
              <div className="absolute bottom-10 left-10 right-10 p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <p className="text-white font-medium italic text-lg leading-relaxed">
                  &quot;The first step towards healing is understanding. We&apos;re here to guide you through every question.&quot;
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Image (Non-sticky) */}
          <div className="lg:hidden w-full mt-8">
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-xl">
              <Image 
                src="/table_tea.webp" 
                alt="Frequently Asked Questions" 
                fill 
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-6 mb-24 md:mb-32">
        <div className="bg-teal-600 rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 relative shadow-2xl overflow-hidden group">
          {/* Subtle background accent */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-transform duration-700 group-hover:scale-110"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 md:gap-8 flex-1 max-w-2xl">
              {/* Calendar Icon */}
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-md rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center shrink-0 border border-white/20 transition-transform duration-500 group-hover:scale-110">
                <CalendarDays className="text-white w-8 h-8 md:w-10 md:h-10" />
              </div>
              
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                  Ready to begin your healing journey?
                </h2>
                <p className="text-teal-50 text-base md:text-lg lg:text-xl font-medium opacity-90 max-w-lg">
                  Book your confidential consultation with our experienced therapist today.
                </p>
              </div>
            </div>

            <div className="shrink-0 w-full lg:w-auto mt-4 lg:mt-0">
              <Link href="/v2/book_appointment">
                <button className="w-full lg:w-auto px-8 py-4 md:px-12 md:py-6 bg-slate-900 text-white rounded-full font-bold text-sm md:text-lg hover:bg-white hover:text-teal-600 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 group/btn">
                  SCHEDULE CONSULTATION
                  <ArrowUpRight size={20} className="md:w-6 md:h-6 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                </button>
              </Link>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
}
