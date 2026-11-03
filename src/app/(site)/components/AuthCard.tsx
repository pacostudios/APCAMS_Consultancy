import React from "react";

export const authInput =
  "w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-teal-600 transition-all font-medium text-slate-900 outline-none";

export const authLabel = "text-[10px] font-bold text-slate-400 uppercase tracking-widest";

export const authButton =
  "w-full py-4 bg-slate-900 text-white rounded-full font-bold text-sm hover:bg-teal-600 transition-all disabled:opacity-40 shadow-xl shadow-slate-200";

/** Centered card used by the customer login and registration pages. */
export function AuthCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 pt-32 pb-16 md:pt-40">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] p-8 md:p-10">
        <div className="mb-8 space-y-2 text-center">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
          <p className="text-slate-500 font-medium text-sm">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

export function FormMessage({ tone, children }: { tone: "error" | "success"; children: React.ReactNode }) {
  const styles = tone === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-teal-200 bg-teal-50 text-teal-800";
  return (
    <p role={tone === "error" ? "alert" : "status"} className={`rounded-2xl border px-4 py-3 text-sm font-medium ${styles}`}>
      {children}
    </p>
  );
}
