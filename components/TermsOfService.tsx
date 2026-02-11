
import React from 'react';
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Scale, UserCheck, X, ShieldX, Hammer } from 'lucide-react';

const TermsOfService: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <button onClick={onBack} className="group flex items-center text-slate-400 font-black text-xs uppercase tracking-[0.3em] mb-16 hover:text-indigo-600 transition-all">
        <ArrowLeft size={16} className="mr-3 group-hover:-translate-x-2 transition-transform" /> Back to Safety Center
      </button>

      <div className="relative mb-24 text-center">
        <div className="inline-flex p-6 bg-slate-900 text-white rounded-[2.5rem] mb-8 shadow-3xl">
          <Scale size={56} />
        </div>
        <h1 className="text-6xl font-[900] text-slate-900 tracking-tighter mb-6 leading-none">Terms of <br />Professional Service</h1>
        <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto italic">Accessing Jobmandu constitutes a legal agreement to follow our code of conduct. We take ethics seriously.</p>
      </div>

      <div className="space-y-16">
        
        <section className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-5 mb-10 text-slate-900">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white"><UserCheck size={24} /></div>
            <h2 className="text-3xl font-black tracking-tight">1. Integrity Clause</h2>
          </div>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">Jobmandu is a platform for genuine career building. We have zero tolerance for deceit or unprofessional behavior.</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 bg-green-50/50 rounded-[2.5rem] border border-green-100">
              <h4 className="font-black text-green-700 text-xs uppercase mb-4 tracking-widest">Mandatory Behavior</h4>
              <ul className="space-y-3 text-sm font-bold text-slate-700">
                <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 mt-1 flex-shrink-0" /> Truthful Identity Verification</li>
                <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 mt-1 flex-shrink-0" /> Legitimate Job Vacancies</li>
                <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 mt-1 flex-shrink-0" /> Respectful Workplace Inquiry</li>
              </ul>
            </div>
            <div className="p-8 bg-red-50/50 rounded-[2.5rem] border border-red-100">
              <h4 className="font-black text-red-700 text-xs uppercase mb-4 tracking-widest">Strict Prohibitions</h4>
              <ul className="space-y-3 text-sm font-bold text-slate-700">
                <li className="flex gap-2"><X size={16} className="text-red-500 mt-1 flex-shrink-0" /> Demanding Money from Candidates</li>
                <li className="flex gap-2"><X size={16} className="text-red-500 mt-1 flex-shrink-0" /> Posting Non-existent Jobs</li>
                <li className="flex gap-2"><X size={16} className="text-red-500 mt-1 flex-shrink-0" /> Using Platform for Advertisement</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-red-600 p-12 rounded-[4rem] text-white relative">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-12 h-12 bg-white text-red-600 rounded-2xl flex items-center justify-center"><ShieldX size={24} /></div>
            <h2 className="text-3xl font-black tracking-tight">2. Fraud & Scam Policy</h2>
          </div>
          <p className="text-xl font-bold mb-8 leading-relaxed">Jobmandu is a "Free for Seekers" portal. Any job provider asking for security deposits, registration fees, or advance payments will be immediately banned and reported to the Cyber Bureau.</p>
          <div className="p-8 bg-black/20 rounded-[2.5rem] border border-white/20">
             <div className="flex items-center gap-3 mb-4 text-amber-300">
                <AlertTriangle size={24} />
                <span className="font-black uppercase tracking-widest text-sm">Legal Warning</span>
             </div>
             <p className="text-sm font-medium leading-relaxed opacity-90">We reserve the right to cooperate with law enforcement authorities in Nepal to prosecute scammers attempting to exploit our community members.</p>
          </div>
        </section>

        <section className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-5 mb-10 text-slate-900">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white"><Hammer size={24} /></div>
            <h2 className="text-3xl font-black tracking-tight">3. Platform Limitation</h2>
          </div>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">While we vet every role, Jobmandu is an intermediary. We are not responsible for the ultimate outcome of the recruitment process or disputes between parties outside our platform features.</p>
          <div className="grid grid-cols-2 gap-6">
             <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Notice Period</div>
                <div className="text-2xl font-black text-slate-900">48 Hours</div>
             </div>
             <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Account Recovery</div>
                <div className="text-2xl font-black text-slate-900">7-10 Days</div>
             </div>
          </div>
        </section>

        <section className="bg-indigo-600 p-16 rounded-[4rem] text-center text-white">
          <FileText className="mx-auto mb-10 opacity-30" size={80} />
          <h2 className="text-4xl font-black mb-6 tracking-tighter">Agreement Finality</h2>
          <p className="text-indigo-100 text-lg font-medium max-w-xl mx-auto mb-10 leading-relaxed">By creating an account, you affirm that all information provided is accurate and that you will use Jobmandu for professional growth only.</p>
          <div className="text-[10px] font-black uppercase tracking-[0.5em] opacity-50">Governed by Laws of Nepal</div>
        </section>

        <div className="text-center py-12">
          <p className="text-slate-400 font-black text-xs uppercase tracking-[0.4em] mb-4">Questions regarding Terms?</p>
          <p className="text-2xl font-black text-slate-900 underline decoration-indigo-500 decoration-4">legal-ops@jobmandu.com.np</p>
        </div>

      </div>
    </div>
  );
};

export default TermsOfService;
