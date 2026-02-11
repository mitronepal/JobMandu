
import React from 'react';
import { Search, MapPin, Users, Globe, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative pt-24 pb-32">
        {/* Abstract Background Orbs */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] bg-violet-50 rounded-full blur-3xl opacity-50 -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-8 animate-bounce">
            <Sparkles size={14} />
            <span>Connecting Talent with Opportunity</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-[900] text-slate-900 tracking-tight leading-[1.1] mb-8">
            The Smartest Way to <br />
            <span className="text-gradient">Work in Nepal.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 mb-12 font-medium leading-relaxed">
            Jobmandu is Nepal's most intuitive job portal. We use technology to make hiring and job seeking seamless, transparent, and incredibly fast.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-200 flex items-center justify-center group"
            >
              Get Started for Free
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-bold text-lg hover:border-slate-300 transition-all">
              Browse Listings
            </button>
          </div>

          <div className="mt-20 flex items-center justify-center space-x-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="font-black text-2xl tracking-tighter">FORBES</span>
            <span className="font-black text-2xl tracking-tighter">NEPALNEWS</span>
            <span className="font-black text-2xl tracking-tighter">TECHNEPAL</span>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900">Why thousands choose Jobmandu</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Zap />, title: "Instant Apply", desc: "Apply to jobs with just one click using your pre-built profile.", color: "text-amber-500", bg: "bg-amber-50" },
              { icon: <ShieldCheck />, title: "Verified Providers", desc: "Every employer is vetted to ensure your security and job authenticity.", color: "text-green-500", bg: "bg-green-50" },
              { icon: <Search />, title: "AI Search", desc: "Our algorithm finds the best roles tailored to your unique skills.", color: "text-blue-500", bg: "bg-blue-50" }
            ].map((f, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className={`${f.bg} ${f.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
