
import React from 'react';
import { ArrowLeft, Book, MessageSquare, ShieldAlert, AlertTriangle, CheckCircle, Home, Briefcase, MapPin, Eye, Phone } from 'lucide-react';

interface HelpCenterProps {
  onBack: () => void;
  onNavigate: (page: 'privacy' | 'terms') => void;
}

const HelpCenter: React.FC<HelpCenterProps> = ({ onBack, onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 animate-in fade-in slide-in-from-top-4 duration-500 text-left">
      <button onClick={onBack} className="flex items-center text-slate-400 font-black text-[10px] uppercase tracking-widest mb-12 hover:text-indigo-600 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Return to Home
      </button>

      <div className="text-center mb-24">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-indigo-100">
           <ShieldAlert size={14} /> Official Safety Center
        </div>
        <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tighter leading-tight">Nepal's Most Trusted <br /><span className="text-indigo-600">Safety Guide.</span></h1>
        <p className="text-slate-500 text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">हाम्रो सुरक्षा टिम र प्रविधिले तपाईंको हरेक पाइलामा सुरक्षा सुनिश्चित गर्दछ।</p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 mb-20">
         <div className="bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-2xl shadow-slate-200/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-100 transition-colors"></div>
            <div className="relative z-10">
               <div className="w-16 h-16 bg-indigo-600 text-white rounded-3xl flex items-center justify-center mb-10 shadow-lg shadow-indigo-100"><Briefcase size={32} /></div>
               <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Job Integrity</h2>
               <p className="text-slate-600 font-medium text-lg leading-relaxed mb-10 italic">"निश्चय गर्नुहोस् कि तपाईं सहि ठाउँमा हुनुहुन्छ।"</p>
               <ul className="space-y-6">
                  {[
                    { text: "Registration Fee वा Uniform शुल्क माग्नेहरू सँग सावधान रहनुहोस्।", icon: <AlertTriangle className="text-red-500" /> },
                    { text: "आधिकारिक अफिस बाहेक बाहिरका ठाउँमा भेट्न नजानुहोस्।", icon: <CheckCircle className="text-green-500" /> },
                    { text: "कुनै शंका लागेमा तुरुन्तै पोष्टलाई रिपोर्ट गर्नुहोस्।", icon: <ShieldAlert className="text-amber-500" /> }
                  ].map((item, i) => (
                    <li key={i} className="flex gap-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 font-bold text-slate-700 text-sm hover:border-indigo-200 transition-colors">
                       <div className="mt-1 flex-shrink-0">{item.icon}</div>
                       <p className="leading-relaxed">{item.text}</p>
                    </li>
                  ))}
               </ul>
            </div>
         </div>

         <div className="bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-2xl shadow-slate-200/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-green-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-green-100 transition-colors"></div>
            <div className="relative z-10">
               <div className="w-16 h-16 bg-green-600 text-white rounded-3xl flex items-center justify-center mb-10 shadow-lg shadow-green-100"><Home size={32} /></div>
               <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Room Safety</h2>
               <p className="text-slate-600 font-medium text-lg leading-relaxed mb-10 italic">"कोठा हेरेर र सम्झौता गरेर मात्र भुक्तानी गर्नुहोस्।"</p>
               <ul className="space-y-6">
                  {[
                    { text: "कोठा नहेरी अनलाइनबाट पैसा कतै पनि नपठाउनुहोस्।", icon: <Eye className="text-indigo-500" /> },
                    { text: "सहि लोकेसन पक्का गर्न हाम्रो म्याप फिचर प्रयोग गर्नुहोस्।", icon: <MapPin className="text-green-500" /> },
                    { text: "अग्रिम भुक्तानी गर्दा सधैं आधिकारिक रसिद माग्नुहोस्।", icon: <Phone className="text-amber-500" /> }
                  ].map((item, i) => (
                    <li key={i} className="flex gap-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 font-bold text-slate-700 text-sm hover:border-green-200 transition-colors">
                       <div className="mt-1 flex-shrink-0">{item.icon}</div>
                       <p className="leading-relaxed">{item.text}</p>
                    </li>
                  ))}
               </ul>
            </div>
         </div>
      </div>

      <div className="bg-slate-900 p-16 rounded-[4rem] text-center text-white relative overflow-hidden border border-white/5 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
           <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[120px]"></div>
        </div>
        <h2 className="text-4xl font-black mb-6 tracking-tighter leading-tight relative z-10">Still have concerns?</h2>
        <p className="text-slate-400 font-medium mb-12 text-lg relative z-10">हाम्रो सपोर्ट टिम २४/७ तपाईंको सेवामा उपलब्ध छ।</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
           <a 
             href="https://wa.me/9779861513184" 
             target="_blank" 
             rel="noreferrer"
             className="w-full sm:w-auto bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-indigo-700 hover:scale-105 transition-all flex items-center justify-center gap-3 active:scale-95"
           >
             <MessageSquare size={18} /> Support Chat
           </a>
           <button 
             onClick={() => onNavigate('privacy')}
             className="w-full sm:w-auto bg-white/5 border border-white/10 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 hover:scale-105 transition-all flex items-center justify-center gap-3 active:scale-95"
           >
             <Book size={18} /> Read Privacy Policies
           </button>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
