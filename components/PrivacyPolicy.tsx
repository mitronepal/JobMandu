
import React from 'react';
import { ArrowLeft, ShieldCheck, Lock, Eye, Database, Globe, CheckCircle, ShieldAlert } from 'lucide-react';

const PrivacyPolicy: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <button onClick={onBack} className="group flex items-center text-slate-400 font-black text-xs uppercase tracking-[0.3em] mb-16 hover:text-indigo-600 transition-all">
        <ArrowLeft size={16} className="mr-3 group-hover:-translate-x-2 transition-transform" /> Return to Marketplace
      </button>

      <div className="text-center mb-24">
        <div className="inline-flex p-6 bg-indigo-50 text-indigo-600 rounded-[2.5rem] mb-8 shadow-inner">
          <ShieldCheck size={56} />
        </div>
        <h1 className="text-6xl font-[900] text-slate-900 tracking-tighter mb-6">Privacy Commitment</h1>
        <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">Your data is not our product. Your success is. Understand how we guard your professional identity at Jobmandu Nepal.</p>
        <div className="mt-8 flex justify-center items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-400">
          <span>March 2025 Edition</span>
          <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
          <span>Compliance Certified</span>
        </div>
      </div>

      <div className="space-y-16">
        
        <section className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-5 mb-10 text-slate-900">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white"><Eye size={24} /></div>
            <h2 className="text-3xl font-black tracking-tight">1. Data Minimization Strategy</h2>
          </div>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">At Jobmandu, we follow the principle of "Data Minimization". We only collect what is strictly necessary to bridge the gap between you and your dream career.</p>
          <div className="grid sm:grid-cols-2 gap-6">
             <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
               <h4 className="font-black text-indigo-600 text-xs uppercase mb-4 tracking-widest">Personal Data</h4>
               <p className="text-sm font-bold text-slate-700">Name, Email, Phone Number, and Profile Photo. This helps us ensure you are a real person and allows employers to call you directly.</p>
             </div>
             <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
               <h4 className="font-black text-indigo-600 text-xs uppercase mb-4 tracking-widest">Platform Interaction</h4>
               <p className="text-sm font-bold text-slate-700">We analyze your job search patterns to feed our AI matching engine, ensuring you see the most relevant roles first.</p>
             </div>
          </div>
        </section>

        <section className="bg-slate-900 p-12 rounded-[4rem] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl -z-0"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-5 mb-10">
              <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white"><Lock size={24} /></div>
              <h2 className="text-3xl font-black tracking-tight">2. Military-Grade Encryption</h2>
            </div>
            <p className="text-lg opacity-80 leading-relaxed mb-10 font-medium">We treat your professional information with the same security standards used by global financial institutions. All data transmission is encrypted using TLS 1.3 protocols.</p>
            <div className="grid grid-cols-3 gap-4">
               {["AES-256 Bit", "SSL Certified", "ISO Compliance"].map(stat => (
                 <div key={stat} className="px-4 py-6 bg-white/5 rounded-3xl border border-white/10 text-center">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">{stat}</div>
                    <div className="text-xl font-black">ACTIVE</div>
                 </div>
               ))}
            </div>
          </div>
        </section>

        <section className="bg-amber-50 p-12 rounded-[3.5rem] border-2 border-amber-100">
          <div className="flex items-center gap-5 mb-10 text-slate-900">
            <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-900"><ShieldAlert size={24} /></div>
            <h2 className="text-3xl font-black tracking-tight">3. Protection from Fraud</h2>
          </div>
          <p className="text-lg text-slate-700 leading-relaxed mb-8 font-bold italic">Your privacy also includes protection from scammers. We use data analysis to identify and ban suspicious job providers who might misuse your contact information.</p>
          <div className="flex items-center gap-3 p-5 bg-white rounded-3xl border border-amber-200 shadow-sm">
             <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
             <p className="text-sm font-bold text-slate-600">We never share your private phone number with advertisers or third-party marketing firms.</p>
          </div>
        </section>

        <section className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-5 mb-10 text-slate-900">
            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white"><Database size={24} /></div>
            <h2 className="text-3xl font-black tracking-tight">4. Your Data, Your Control</h2>
          </div>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">You are the sole owner of your career profile. You have the permanent right to:</p>
          <div className="space-y-4">
             {[
               "Request a complete copy of your data stored on our servers.",
               "Rectify any professional information that is inaccurate.",
               "Delete your entire account and all associated data permanently.",
               "Opt-out of AI-based profiling and automated matching."
             ].map((text, idx) => (
               <div key={idx} className="flex gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0">{idx + 1}</div>
                  <p className="text-sm font-bold text-slate-700 leading-relaxed">{text}</p>
               </div>
             ))}
          </div>
        </section>

        <div className="text-center pt-20 border-t border-slate-100">
          <Globe className="mx-auto text-slate-200 mb-8" size={64} />
          <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-4">Global Privacy Standards</h4>
          <p className="max-w-xl mx-auto text-slate-500 font-medium">Jobmandu Nepal complies with the Electronic Transactions Act (2063) and International Data Protection Guidelines to ensure your digital safety.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
