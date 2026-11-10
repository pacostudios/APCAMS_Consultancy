"use client";

import React, { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar as CalendarIcon,
  ArrowLeft,
  ArrowRight,
  Brain,
  Heart,
  Compass,
  Target,
  ShieldCheck,
  Sparkles,
  Scale,
  Users,
  ArrowUpRight,
  Info,
  User,
  MapPin,
  Phone,
  LayoutGrid,
  Video,
  Loader2,
  CreditCard,
  Mail,
  KeyRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { addDaysToKey, formatAUD, toDateKey, zoneLabel } from "@/lib/format";
import { bookSessionAction, cancelPendingPaymentAction, resumePaymentAction } from "./actions";

type Service = { id: number; slug: string; name: string; priceCents: number; durationMins: number };
type Slot = { start: string; local: string; label: string };

const ICONS: Record<string, React.ReactNode> = {
  psychotherapy: <Brain size={18} />,
  "counselling-services": <Heart size={18} />,
  "meditation-programs": <Compass size={18} />,
  "personal-growth": <Target size={18} />,
  "addiction-support": <ShieldCheck size={18} />,
  "healing-recovery": <Sparkles size={18} />,
  mediation: <Scale size={18} />,
  "residential-couples-therapy": <Users size={18} />,
};

const DAYS_AHEAD = 14;

const PERIODS = [
  { id: "morning", label: "Morning", test: (h: number) => h < 12 },
  { id: "afternoon", label: "Afternoon", test: (h: number) => h >= 12 && h < 17 },
  { id: "evening", label: "Evening", test: (h: number) => h >= 17 },
];

/** Day tile labels for a "YYYY-MM-DD" key, independent of the visitor's own timezone. */
function dayParts(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const fmt = (o: Intl.DateTimeFormatOptions) => date.toLocaleDateString("en-AU", { ...o, timeZone: "UTC" });
  return { dayName: fmt({ weekday: "short" }), dayNum: d, month: fmt({ month: "short" }), long: fmt({ weekday: "long", day: "numeric", month: "long" }) };
}

export default function BookingForm({
  services,
  initialSlug,
  defaults,
  paymentsEnabled,
  paymentCancelled,
  signedInEmail,
  staffEmail,
  pendingPayment,
}: {
  services: Service[];
  initialSlug: string;
  defaults: { name: string; phone: string; address: string };
  paymentsEnabled: boolean;
  paymentCancelled: boolean;
  signedInEmail: string | null;
  /** Set when an admin or staff member is signed in; they must sign out before booking. */
  staffEmail: string | null;
  /** A booking still holding its slot because the customer left the Stripe page without paying. */
  pendingPayment: { serviceName: string; when: string; heldUntil: string } | null;
}) {
  const router = useRouter();
  const [pendingBusy, startPending] = useTransition();
  const [pendingError, setPendingError] = useState("");

  // Pressing Back on Stripe can restore this page from the browser cache, frozen mid-submit with every
  // button disabled. Reload it so the form resets and the unfinished payment shows below.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) window.location.reload();
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);
  const [currentStep, setCurrentStep] = useState(1);
  const [[, direction], setStepPage] = useState([1, 0]);
  const [formData, setFormData] = useState({
    ...defaults,
    email: signedInEmail ?? "",
    serviceId: services.find((s) => s.slug === initialSlug)?.id ?? 0,
    date: "",
    slot: null as Slot | null,
  });

  // Email check: a 6-digit code is emailed and entering it signs the visitor in (creating their account if new).
  const [verified, setVerified] = useState(Boolean(signedInEmail));
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [codeBusy, setCodeBusy] = useState(false);

  // Returning customers who just signed in: fill in the details we already have on file.
  useEffect(() => {
    setFormData((f) => ({ ...f, name: f.name || defaults.name, phone: f.phone || defaults.phone, address: f.address || defaults.address }));
  }, [defaults.name, defaults.phone, defaults.address]);
  const [website, setWebsite] = useState(""); // honeypot
  const mountedAt = useRef(0);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsVersion, setSlotsVersion] = useState(0); // bump to refetch
  const [error, setError] = useState("");
  const [isSubmitting, startSubmit] = useTransition();

  const selectedService = services.find((s) => s.id === formData.serviceId);
  const paysOnline = paymentsEnabled && (selectedService?.priceCents ?? 0) > 0;
  const dates = useMemo(() => {
    const today = toDateKey(new Date());
    return Array.from({ length: DAYS_AHEAD }, (_, i) => addDaysToKey(today, i));
  }, []);

  // Opening the schedule without a day picked: jump to the first day that has free times.
  const [noAvailability, setNoAvailability] = useState(false);
  useEffect(() => {
    if (currentStep !== 3 || !formData.serviceId || formData.date) return;
    const controller = new AbortController();
    setNoAvailability(false);
    setSlotsLoading(true);
    fetch(`/api/slots?first=1&days=${DAYS_AHEAD}&service=${formData.serviceId}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data: { date: string | null }) => {
        if (data.date) setFormData((f) => (f.date ? f : { ...f, date: data.date!, slot: null }));
        else setNoAvailability(true);
      })
      .catch(() => {})
      .finally(() => setSlotsLoading(false));
    return () => controller.abort();
  }, [currentStep, formData.serviceId, formData.date]);

  // Keep the chosen day visible in the horizontal date strip (the first free day may be off to the right).
  useEffect(() => {
    if (currentStep !== 3 || !formData.date) return;
    document.querySelector(`[data-date="${formData.date}"]`)?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [currentStep, formData.date]);

  // Load free times whenever the service or day changes.
  useEffect(() => {
    if (!formData.serviceId || !formData.date) return;
    const controller = new AbortController();
    setSlotsLoading(true);
    setSlots(null);
    fetch(`/api/slots?date=${formData.date}&service=${formData.serviceId}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data: { slots?: Slot[] }) => setSlots(data.slots ?? []))
      .catch((e) => {
        if (e.name !== "AbortError") setSlots([]);
      })
      .finally(() => setSlotsLoading(false));
    return () => controller.abort();
  }, [formData.serviceId, formData.date, slotsVersion]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const paginate = (newStep: number) => {
    setStepPage([newStep, newStep > currentStep ? 1 : -1]);
    setCurrentStep(newStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const detailsFilled = Boolean(formData.name.trim() && formData.phone.trim() && /^\S+@\S+\.\S+$/.test(formData.email.trim()));
  const detailsComplete = detailsFilled && verified;

  const sendCode = async () => {
    setCodeError("");
    setCodeBusy(true);
    const { error } = await authClient.emailOtp.sendVerificationOtp({ email: formData.email.trim(), type: "sign-in" });
    setCodeBusy(false);
    if (error) return setCodeError(error.status === 429 ? "Too many codes requested. Please wait a minute and try again." : "We couldn't send a code. Please check your email address.");
    setCode("");
    setCodeSent(true);
  };

  const verifyCode = async () => {
    setCodeError("");
    setCodeBusy(true);
    const { error } = await authClient.signIn.emailOtp({ email: formData.email.trim(), otp: code.trim(), name: formData.name.trim() });
    setCodeBusy(false);
    if (error) return setCodeError("That code isn't right or has expired. Check your email or send a new code.");
    setVerified(true);
    // Picks up the new session (navbar, saved phone/address); the form keeps its state.
    router.refresh();
    paginate(2);
  };

  const signOut = async () => {
    await authClient.signOut();
    setVerified(false);
    setFormData((f) => ({ ...f, name: "", email: "", phone: "", address: "" }));
    setCodeSent(false);
    router.refresh();
  };

  const handleSubmit = () => {
    if (!detailsComplete || !formData.serviceId || !formData.slot) return;
    setError("");
    startSubmit(async () => {
      // On success the action redirects to the account page, so only errors come back.
      const result = await bookSessionAction({
        serviceId: formData.serviceId,
        start: formData.slot!.start,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        website,
        elapsedMs: Date.now() - mountedAt.current,
      });
      if (result?.error) {
        setError(result.error);
        // The slot may have been taken: refresh the list.
        setFormData((f) => ({ ...f, slot: null }));
        setSlotsVersion((v) => v + 1);
      }
    });
  };

  const stepVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 30 : -30, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? 30 : -30, opacity: 0 }),
  };

  const ConfirmButton = ({ className = "" }: { className?: string }) => (
    <button
      onClick={handleSubmit}
      disabled={!formData.slot || isSubmitting}
      className={`w-full py-5 bg-teal-600 text-white rounded-full font-bold text-lg hover:bg-white hover:text-teal-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-teal-900/20 disabled:opacity-20 ${className}`}
    >
      {isSubmitting ? (paysOnline ? "OPENING PAYMENT..." : "BOOKING...") : paysOnline ? "CONTINUE TO PAYMENT" : "CONFIRM APPOINTMENT"}
      {isSubmitting ? <Loader2 size={22} className="animate-spin" /> : paysOnline ? <CreditCard size={22} /> : <ArrowUpRight size={22} />}
    </button>
  );

  const ErrorMessage = () =>
    error ? (
      <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
        {error}
      </p>
    ) : null;

  return (
    <div className="max-w-7xl mx-auto px-6 pt-28 md:pt-36 pb-12 md:pb-20 min-h-[80vh]">
      {staffEmail && (
        <div role="status" className="max-w-3xl mx-auto mb-10 rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-800 flex flex-wrap items-center justify-between gap-3">
          <span>You&apos;re signed in as {staffEmail} (staff). Sign out to book as a customer.</span>
          <button type="button" onClick={signOut} className="font-bold text-amber-900 underline">Sign out</button>
        </div>
      )}
      {pendingPayment && (
        <div role="status" className="max-w-3xl mx-auto mb-10 rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-800 space-y-3">
          <p>
            You haven&apos;t paid for <span className="font-bold">{pendingPayment.serviceName}</span> on {pendingPayment.when} yet. We&apos;re holding that
            time for you until {pendingPayment.heldUntil}. Choosing a new time below cancels it.
          </p>
          {pendingError && <p className="text-red-700">{pendingError}</p>}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={pendingBusy}
              onClick={() =>
                startPending(async () => {
                  setPendingError("");
                  // Redirects to Stripe on success.
                  const result = await resumePaymentAction();
                  if (result?.error) {
                    setPendingError(result.error);
                    router.refresh();
                  }
                })
              }
              className="px-5 py-2.5 bg-teal-600 text-white rounded-full font-bold text-xs hover:bg-slate-900 transition-all disabled:opacity-40 flex items-center gap-2"
            >
              {pendingBusy ? <Loader2 size={14} className="animate-spin" /> : <CreditCard size={14} />} CONTINUE TO PAYMENT
            </button>
            <button
              type="button"
              disabled={pendingBusy}
              onClick={() =>
                startPending(async () => {
                  await cancelPendingPaymentAction();
                  setSlotsVersion((v) => v + 1); // the freed time shows up again
                  router.refresh();
                })
              }
              className="px-5 py-2.5 border-2 border-amber-200 text-amber-900 rounded-full font-bold text-xs hover:border-amber-400 transition-all disabled:opacity-40"
            >
              CANCEL IT
            </button>
          </div>
        </div>
      )}
      {paymentCancelled && (
        <p role="status" className="max-w-3xl mx-auto mb-10 rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-800">
          Payment cancelled, so the time you picked has been released. You can choose a time again below.
        </p>
      )}
      {/* PROGRESS STEPPER */}
      <div className="max-w-3xl mx-auto mb-16 md:mb-24 relative">
        <div className="absolute top-5 md:top-7 left-0 w-full h-0.5 bg-slate-100 z-0"></div>
        <motion.div
          className="absolute top-5 md:top-7 left-0 h-0.5 bg-teal-600 z-0"
          animate={{ width: `${(currentStep - 1) * 50}%` }}
          transition={{ duration: 0.5 }}
        />

        <div className="relative flex justify-between items-start">
          {[
            { step: 1, label: "Details", icon: <User size={18} /> },
            { step: 2, label: "Service", icon: <LayoutGrid size={18} /> },
            { step: 3, label: "Schedule", icon: <CalendarIcon size={18} /> },
          ].map((item) => (
            <div key={item.step} className="relative z-10 flex flex-col items-center gap-3">
              <button
                disabled={item.step > currentStep && (item.step === 2 ? !detailsComplete : item.step === 3 ? !formData.serviceId || !detailsComplete : false)}
                onClick={() => paginate(item.step)}
                className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-4 ${
                  currentStep === item.step
                    ? "bg-teal-600 border-white text-white scale-110 shadow-lg"
                    : currentStep > item.step
                      ? "bg-white border-teal-600 text-teal-600"
                      : "bg-white border-slate-100 text-slate-300"
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
                    <p className="text-slate-500 font-medium">
                      {verified ? "Confirm how we can reach you." : "Tell us how to reach you. We'll email you a code to confirm it's you."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <User size={14} className="text-teal-600" /> Full Name
                      </label>
                      <input id="name" name="name" value={formData.name} onChange={handleInputChange} autoComplete="name" placeholder="Jane Citizen" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-teal-600 transition-all font-medium text-slate-900 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Mail size={14} className="text-teal-600" /> Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          handleInputChange(e);
                          setCodeSent(false); // a code only works for the address it was sent to
                        }}
                        readOnly={verified}
                        autoComplete="email"
                        placeholder="jane@example.com"
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-teal-600 transition-all font-medium text-slate-900 outline-none read-only:text-slate-500"
                      />
                      {verified && (
                        <p className="text-xs text-slate-400 font-medium">
                          Signed in.{" "}
                          <button type="button" onClick={signOut} className="font-bold text-teal-600 hover:underline">
                            Not you?
                          </button>
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Phone size={14} className="text-teal-600" /> Phone Number
                      </label>
                      <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} autoComplete="tel" placeholder="04XX XXX XXX" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-teal-600 transition-all font-medium text-slate-900 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="address" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <MapPin size={14} className="text-teal-600" /> Residential Address <span className="normal-case tracking-normal font-medium">(optional)</span>
                      </label>
                      <input id="address" name="address" value={formData.address} onChange={handleInputChange} autoComplete="street-address" placeholder="12 Example St, Sydney NSW 2000" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-teal-600 transition-all font-medium text-slate-900 outline-none" />
                    </div>
                    {/* Honeypot: hidden from people, tempting to bots. */}
                    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                      <label htmlFor="website">Website</label>
                      <input id="website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                    </div>
                  </div>

                  {verified ? (
                    <div className="pt-6">
                      <button
                        disabled={!detailsComplete}
                        onClick={() => paginate(2)}
                        className="px-10 py-4 bg-slate-900 text-white rounded-full font-bold text-sm hover:bg-teal-600 transition-all flex items-center gap-2 group disabled:opacity-20 shadow-xl shadow-slate-200"
                      >
                        NEXT: SELECT SERVICE
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                      {!detailsComplete && <p className="mt-3 text-xs text-slate-400 font-medium">Enter your full name and phone number to continue.</p>}
                    </div>
                  ) : !codeSent ? (
                    <div className="pt-6 space-y-4">
                      {codeError && (
                        <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{codeError}</p>
                      )}
                      <button
                        disabled={!detailsFilled || codeBusy}
                        onClick={sendCode}
                        className="px-10 py-4 bg-slate-900 text-white rounded-full font-bold text-sm hover:bg-teal-600 transition-all flex items-center gap-2 group disabled:opacity-20 shadow-xl shadow-slate-200"
                      >
                        {codeBusy ? "SENDING CODE..." : "EMAIL ME A CODE"}
                        {codeBusy ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                      </button>
                    </div>
                  ) : (
                    <div className="pt-6 space-y-4 max-w-sm">
                      <p className="text-sm text-slate-600 font-medium">
                        We&apos;ve emailed a 6-digit code to <span className="font-bold text-slate-900">{formData.email}</span>. It expires in 10 minutes.
                      </p>
                      <div className="space-y-2">
                        <label htmlFor="code" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <KeyRound size={14} className="text-teal-600" /> Code
                        </label>
                        <input
                          id="code"
                          value={code}
                          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          placeholder="123456"
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-teal-600 transition-all font-bold tracking-[0.4em] text-slate-900 outline-none"
                        />
                      </div>
                      {codeError && (
                        <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{codeError}</p>
                      )}
                      <button
                        disabled={code.length !== 6 || codeBusy}
                        onClick={verifyCode}
                        className="px-10 py-4 bg-slate-900 text-white rounded-full font-bold text-sm hover:bg-teal-600 transition-all flex items-center gap-2 group disabled:opacity-20 shadow-xl shadow-slate-200"
                      >
                        {codeBusy ? "CHECKING..." : "VERIFY & CONTINUE"}
                        {codeBusy ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                      </button>
                      <button type="button" onClick={sendCode} disabled={codeBusy} className="text-xs font-bold text-teal-600 hover:underline disabled:opacity-40">
                        Send a new code
                      </button>
                    </div>
                  )}
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
                    {services.map((s) => {
                      const selected = formData.serviceId === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => setFormData({ ...formData, serviceId: s.id, date: "", slot: null })}
                          className={`p-4 rounded-2xl border-2 text-center transition-all duration-300 group ${
                            selected
                              ? "border-teal-600 bg-teal-600 text-white shadow-lg shadow-teal-600/20"
                              : "border-slate-50 bg-white hover:bg-teal-600 hover:text-white hover:border-teal-600 text-slate-600"
                          }`}
                        >
                          <div
                            className={`mx-auto w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-colors ${
                              selected ? "bg-white/20 text-white" : "bg-teal-50 text-teal-600 group-hover:bg-white/20 group-hover:text-white"
                            }`}
                          >
                            {ICONS[s.slug] ?? <Sparkles size={18} />}
                          </div>
                          <span className="text-[10px] md:text-xs font-bold uppercase tracking-wide leading-tight block">{s.name}</span>
                          <span className={`mt-1 block text-[10px] font-medium ${selected ? "text-white/80" : "text-slate-400 group-hover:text-white/80"}`}>
                            {s.durationMins} min · {formatAUD(s.priceCents)}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-6">
                    <button
                      disabled={!formData.serviceId}
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
                      <p className="text-slate-500 font-medium">
                        Available times for {selectedService?.name}, shown in Sydney time ({zoneLabel()}).
                      </p>
                    </div>
                    <button onClick={() => paginate(2)} className="flex items-center gap-2 text-slate-400 font-bold hover:text-teal-600 transition-colors uppercase tracking-widest text-[10px] w-fit">
                      <ArrowLeft size={14} /> Back to Service
                    </button>
                  </div>

                  {/* Horizontal Date Picker */}
                  <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                    {dates.map((key) => {
                      const day = dayParts(key);
                      return (
                        <button
                          key={key}
                          data-date={key}
                          onClick={() => setFormData({ ...formData, date: key, slot: null })}
                          className={`flex-shrink-0 w-20 py-5 rounded-[1.5rem] border-2 flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
                            formData.date === key ? "border-teal-600 bg-teal-600 text-white shadow-lg" : "border-slate-50 bg-white hover:border-teal-200 text-slate-500"
                          }`}
                        >
                          <span className="text-[9px] font-bold uppercase tracking-widest opacity-80">{day.dayName}</span>
                          <span className="text-2xl font-bold">{day.dayNum}</span>
                          <span className="text-[9px] font-bold uppercase tracking-widest opacity-80">{day.month}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Time Slots */}
                  <div className="space-y-10 pt-8 border-t border-slate-50">
                    {!formData.date && noAvailability ? (
                      <p className="text-slate-500 font-medium">
                        No times are available for {selectedService?.name} in the next {DAYS_AHEAD} days. Please contact us and we&apos;ll find a time for you.
                      </p>
                    ) : !formData.date && !slotsLoading ? (
                      <p className="text-slate-400 font-medium">Choose a day to see available times.</p>
                    ) : slotsLoading || slots === null ? (
                      <p className="flex items-center gap-2 text-slate-400 font-medium">
                        <Loader2 size={16} className="animate-spin" /> Checking availability…
                      </p>
                    ) : slots.length === 0 ? (
                      <p className="text-slate-500 font-medium">No times left on {dayParts(formData.date).long}. Please try another day.</p>
                    ) : (
                      PERIODS.map((period) => {
                        const inPeriod = slots.filter((s) => period.test(Number(s.local.slice(11, 13))));
                        if (inPeriod.length === 0) return null;
                        return (
                          <div key={period.id} className="space-y-6">
                            <h4 className="text-[10px] font-bold text-teal-600 uppercase tracking-[0.2em]">{period.label}</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {inPeriod.map((s) => (
                                <button
                                  key={s.start}
                                  onClick={() => setFormData({ ...formData, slot: s })}
                                  className={`py-4 rounded-2xl border-2 font-bold text-xs uppercase transition-all duration-300 ${
                                    formData.slot?.start === s.start ? "border-teal-600 bg-teal-600 text-white shadow-lg" : "border-slate-50 bg-white hover:border-teal-200 text-slate-600"
                                  }`}
                                >
                                  {s.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Mobile Only Submit Button */}
                  <div className="pt-8 lg:hidden space-y-4">
                    <ErrorMessage />
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
                    <p className="text-[9px] font-bold text-teal-400 uppercase tracking-widest mb-1">Client</p>
                    <h4 className="font-bold">{formData.name || "Enter your name"}</h4>
                  </div>
                  <div className={`p-5 rounded-2xl bg-white/5 border border-white/10 transition-all ${selectedService ? "opacity-100" : "opacity-30"}`}>
                    <p className="text-[9px] font-bold text-teal-400 uppercase tracking-widest mb-1">Service</p>
                    <h4 className="font-bold">{selectedService?.name || "Select a service"}</h4>
                    {selectedService && (
                      <p className="text-xs text-slate-400 mt-1">
                        {selectedService.durationMins} min · {formatAUD(selectedService.priceCents)}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-5 rounded-2xl bg-white/5 border border-white/10 transition-all ${formData.date ? "opacity-100" : "opacity-30"}`}>
                      <p className="text-[9px] font-bold text-teal-400 uppercase tracking-widest mb-1">Date</p>
                      <h4 className="font-bold text-sm">{formData.date ? `${dayParts(formData.date).dayName} ${dayParts(formData.date).dayNum} ${dayParts(formData.date).month}` : "---"}</h4>
                    </div>
                    <div className={`p-5 rounded-2xl bg-white/5 border border-white/10 transition-all ${formData.slot ? "opacity-100" : "opacity-30"}`}>
                      <p className="text-[9px] font-bold text-teal-400 uppercase tracking-widest mb-1">Time</p>
                      <h4 className="font-bold text-sm uppercase">{formData.slot?.label || "---"}</h4>
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <Video size={18} className="text-teal-400 shrink-0" />
                    <p className="text-xs text-slate-300">
                      Online session on Zoom.{" "}
                      {paysOnline
                        ? "You'll pay securely with Stripe; your time is held for 30 minutes while you do. Your Zoom link appears in your account once paid."
                        : "Your link appears in your account as soon as you book."}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 space-y-4">
                  {currentStep === 3 ? (
                    <>
                      <ErrorMessage />
                      <ConfirmButton />
                    </>
                  ) : (
                    <p className="text-[10px] text-center text-slate-500 uppercase tracking-widest font-bold">Secure clinical booking</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-teal-50 border border-teal-100 rounded-[2.5rem] p-8 flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-teal-600 shrink-0 shadow-sm">
                <Info size={20} />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">Your details are kept private and only used to manage your sessions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
