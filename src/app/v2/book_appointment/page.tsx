"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle2, 
  Brain, 
  Heart, 
  Compass, 
  Target, 
  ShieldCheck, 
  Sparkles,
  ArrowUpRight,
  Info,
  User,
  MapPin,
  Phone,
  LayoutGrid
} from "lucide-react";

// Service Data
const SERVICES = [
  { id: "psychotherapy", title: "Psychotherapy", icon: <Brain size={18} /> },
  { id: "counselling-services", title: "Counseling", icon: <Heart size={18} /> },
  { id: "meditation-programs", title: "Meditation", icon: <Compass size={18} /> },
  { id: "personal-growth", title: "Personal Growth", icon: <Target size={18} /> },
  { id: "addiction-support", title: "Addiction", icon: <ShieldCheck size={18} /> },
  { id: "healing-recovery", title: "Healing", icon: <Sparkles size={18} /> },
];

const TIME_SLOTS = [
  { id: "morning", label: "Morning", times: ["09:00 AM", "10:00 AM", "11:00 AM"] },
  { id: "afternoon", label: "Afternoon", times: ["01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"] },
  { id: "evening", label: "Evening", times: ["06:00 PM", "07:00 PM", "08:00 PM"] },
];

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialService = searchParams.get("service");

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    selectedService: initialService || "",
    selectedDate: "",
    selectedTime: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync initial service from URL
  useEffect(() => {
    if (initialService) {
      setFormData(prev => ({ ...prev, selectedService: initialService }));
    }
  }, [initialService]);

  const currentServiceDetails = SERVICES.find(s => s.id === formData.selectedService);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServiceSelect = (id: string) => {
    setFormData({ ...formData, selectedService: id });
  };

  const handleDateSelect = (date: string) => {
    setFormData({ ...formData, selectedDate: date });
  };

  const handleTimeSelect = (time: string) => {
    setFormData({ ...formData, selectedTime: time });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.selectedService || !formData.selectedDate || !formData.selectedTime) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    alert("Booking Request Sent! We will contact you shortly.");
    router.push("/v2");
  };

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      full: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' })
    };
  });

  const [[stepPage, direction], setStepPage] = useState([1, 0]);

  const paginate = (newStep: number) => {
    setStepPage([newStep, newStep > currentStep ? 1 : -1]);
    setCurrentStep(newStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stepVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 30 : -30, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? 30 : -30, opacity: 0 })
  };

  // Shared Submit Button Component
  const ConfirmButton = ({ className = "" }: { className?: string }) => (
    <button 
      onClick={handleSubmit} 
      disabled={!formData.selectedDate || !formData.selectedTime || isSubmitting} 
      className={`w-full py-5 bg-teal-600 text-white rounded-full font-bold text-lg hover:bg-white hover:text-teal-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-teal-900/20 disabled:opacity-20 ${className}`}
    >
      {isSubmitting ? "BOOKING..." : "CONFIRM APPOINTMENT"}
      <ArrowUpRight size={22} />
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 min-h-[80vh]">
      
      {/* PROGRESS STEPPER */}
      <div className="max-w-3xl mx-auto mb-16 md:mb-24 relative">
        {/* Background Line */}
        <div className="absolute top-5 md:top-7 left-0 w-full h-0.5 bg-slate-100 z-0"></div>
        {/* Active Line */}
        <motion.div 
          className="absolute top-5 md:top-7 left-0 h-0.5 bg-teal-600 z-0"
          animate={{ width: `${(currentStep - 1) * 50}%` }}
          transition={{ duration: 0.5 }}
        />
        
        <div className="relative flex justify-between items-start">
          {[
            { step: 1, label: "Details", icon: <User size={18} /> },
            { step: 2, label: "Service", icon: <LayoutGrid size={18} /> },
            { step: 3, label: "Schedule", icon: <CalendarIcon size={18} /> }
          ].map((item) => (
            <div key={item.step} className="relative z-10 flex flex-col items-center gap-3">
              <button
                disabled={item.step > currentStep && (
                  item.step === 2 ? (!formData.name || !formData.phone || !formData.address) : 
                  item.step === 3 ? (!formData.selectedService) : false
                )}
                onClick={() => paginate(item.step)}
                className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-4 ${
                  currentStep === item.step ? "bg-teal-600 border-white text-white scale-110 shadow-lg" : 
                  currentStep > item.step ? "bg-white border-teal-600 text-teal-600" : "bg-white border-slate-100 text-slate-300"
                }`}
              >
                {item.icon}
              </button>
              <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest ${currentStep >= item.step ? "text-slate-900" : "text-slate-400"}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT COLUMN: STEP CONTENT */}
        <div className="lg:col-span-7">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-10"
            >
              {/* STEP 1: PERSONAL DETAILS */}
              {currentStep === 1 && (
                <div className="space-y-12">
                  <div className="space-y-2">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">Your Details</h2>
                    <p className="text-slate-500 font-medium">Let's start with some basic information.</p>
                  </div>

                  {/* Form Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <User size={14} className="text-teal-600" /> Full Name
                      </label>
                      <input name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-teal-600 transition-all font-medium text-slate-900 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Phone size={14} className="text-teal-600" /> Phone Number
                      </label>
                      <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+1 (000) 000-0000" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-teal-600 transition-all font-medium text-slate-900 outline-none" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <MapPin size={14} className="text-teal-600" /> Residential Address
                      </label>
                      <input name="address" value={formData.address} onChange={handleInputChange} placeholder="123 Street Name, City, Country" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-teal-600 transition-all font-medium text-slate-900 outline-none" />
                    </div>
                  </div>

                  <div className="pt-6">
                    <button 
                      disabled={!formData.name || !formData.phone || !formData.address}
                      onClick={() => paginate(2)}
                      className="px-10 py-4 bg-slate-900 text-white rounded-full font-bold text-sm hover:bg-teal-600 transition-all flex items-center gap-2 group disabled:opacity-20 shadow-xl shadow-slate-200"
                    >
                      NEXT: SELECT SERVICE
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: SERVICE SELECTION */}
              {currentStep === 2 && (
                <div className="space-y-12">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">Select Service</h2>
                      <p className="text-slate-500 font-medium">Choose the session type you wish to book.</p>
                    </div>
                    <button onClick={() => paginate(1)} className="flex items-center gap-2 text-slate-400 font-bold hover:text-teal-600 transition-colors uppercase tracking-widest text-[10px] w-fit">
                      <ArrowLeft size={14} /> Back to Details
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {SERVICES.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => handleServiceSelect(service.id)}
                        className={`p-4 rounded-2xl border-2 text-center transition-all duration-300 group ${
                          formData.selectedService === service.id 
                          ? "border-teal-600 bg-teal-600 text-white shadow-lg shadow-teal-600/20" 
                          : "border-slate-50 bg-white hover:bg-teal-600 hover:text-white hover:border-teal-600 text-slate-600"
                        }`}
                      >
                        <div className={`mx-auto w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-colors ${
                          formData.selectedService === service.id ? "bg-white/20 text-white" : "bg-teal-50 text-teal-600 group-hover:bg-white/20 group-hover:text-white"
                        }`}>
                          {service.icon}
                        </div>
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-wide leading-tight block">{service.title}</span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-6">
                    <button 
                      disabled={!formData.selectedService}
                      onClick={() => paginate(3)}
                      className="px-10 py-4 bg-slate-900 text-white rounded-full font-bold text-sm hover:bg-teal-600 transition-all flex items-center gap-2 group disabled:opacity-20 shadow-xl shadow-slate-200"
                    >
                      NEXT: CHOOSE SCHEDULE
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: SCHEDULE (DATE & TIME) */}
              {currentStep === 3 && (
                <div className="space-y-12">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">Pick a Slot</h2>
                      <p className="text-slate-500 font-medium">Available times for {currentServiceDetails?.title}</p>
                    </div>
                    <button onClick={() => paginate(2)} className="flex items-center gap-2 text-slate-400 font-bold hover:text-teal-600 transition-colors uppercase tracking-widest text-[10px] w-fit">
                      <ArrowLeft size={14} /> Back to Service
                    </button>
                  </div>

                  {/* Horizontal Date Picker */}
                  <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                    {dates.map((date) => (
                      <button key={date.full} onClick={() => handleDateSelect(date.full)} className={`flex-shrink-0 w-20 py-5 rounded-[1.5rem] border-2 flex flex-col items-center justify-center gap-2 transition-all duration-300 ${formData.selectedDate === date.full ? "border-teal-600 bg-teal-600 text-white shadow-lg" : "border-slate-50 bg-white hover:border-teal-200 text-slate-500"}`}>
                        <span className="text-[9px] font-bold uppercase tracking-widest opacity-80">{date.dayName}</span>
                        <span className="text-2xl font-bold">{date.dayNum}</span>
                        <span className="text-[9px] font-bold uppercase tracking-widest opacity-80">{date.month}</span>
                      </button>
                    ))}
                  </div>

                  {/* Time Slots */}
                  <div className="space-y-10 pt-8 border-t border-slate-50">
                    {TIME_SLOTS.map((slot) => (
                      <div key={slot.id} className="space-y-6">
                        <h4 className="text-[10px] font-bold text-teal-600 uppercase tracking-[0.2em]">{slot.label}</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {slot.times.map((time) => (
                            <button key={time} onClick={() => handleTimeSelect(time)} className={`py-4 rounded-2xl border-2 font-bold text-xs transition-all duration-300 ${formData.selectedTime === time ? "border-teal-600 bg-teal-600 text-white shadow-lg" : "border-slate-50 bg-white hover:border-teal-200 text-slate-600"}`}>
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mobile Only Submit Button */}
                  <div className="pt-8 lg:hidden">
                    <ConfirmButton />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: SUMMARY SIDEBAR */}
        <div className="lg:col-span-5 hidden lg:block">
          <div className="sticky top-32 space-y-8">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10 space-y-8">
                <h3 className="text-2xl font-bold tracking-tight">Booking Summary</h3>
                <div className="space-y-4">
                  <div className={`p-5 rounded-2xl bg-white/5 border border-white/10 transition-all ${formData.name ? "opacity-100" : "opacity-30"}`}>
                    <p className="text-[9px] font-bold text-teal-400 uppercase tracking-widest mb-1">Patient</p>
                    <h4 className="font-bold">{formData.name || "Enter your name"}</h4>
                  </div>
                  <div className={`p-5 rounded-2xl bg-white/5 border border-white/10 transition-all ${formData.selectedService ? "opacity-100" : "opacity-30"}`}>
                    <p className="text-[9px] font-bold text-teal-400 uppercase tracking-widest mb-1">Service</p>
                    <h4 className="font-bold">{currentServiceDetails?.title || "Select a service"}</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-5 rounded-2xl bg-white/5 border border-white/10 transition-all ${formData.selectedDate ? "opacity-100" : "opacity-30"}`}>
                      <p className="text-[9px] font-bold text-teal-400 uppercase tracking-widest mb-1">Date</p>
                      <h4 className="font-bold text-sm">{formData.selectedDate || "---"}</h4>
                    </div>
                    <div className={`p-5 rounded-2xl bg-white/5 border border-white/10 transition-all ${formData.selectedTime ? "opacity-100" : "opacity-30"}`}>
                      <p className="text-[9px] font-bold text-teal-400 uppercase tracking-widest mb-1">Time</p>
                      <h4 className="font-bold text-sm">{formData.selectedTime || "---"}</h4>
                    </div>
                  </div>
                </div>

                {/* Primary Action Button (Desktop Sidebar) */}
                <div className="pt-6 border-t border-white/5 space-y-6">
                   {currentStep === 3 ? (
                     <ConfirmButton />
                   ) : (
                     <p className="text-[10px] text-center text-slate-500 uppercase tracking-widest font-bold">
                      Secure clinical booking
                    </p>
                   )}
                </div>
              </div>
            </div>
            
            <div className="bg-teal-50 border border-teal-100 rounded-[2.5rem] p-8 flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-teal-600 shrink-0 shadow-sm"><Info size={20} /></div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">Your data is secured using end-to-end clinical grade encryption standards.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function V2BookAppointment() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-teal-600 font-bold animate-pulse">Loading Booking System...</div>}>
      <BookingContent />
    </Suspense>
  );
}
