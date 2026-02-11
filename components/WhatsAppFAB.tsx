
import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';

const WhatsAppFAB: React.FC = () => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowText(true);
      setTimeout(() => setShowText(false), 4000);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end">
      {showText && (
        <div className="bg-white px-4 py-2 rounded-2xl shadow-xl border border-slate-100 mb-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
           <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Need help? Chat with us!</p>
        </div>
      )}
      <a 
        href="https://wa.me/9779861513184" 
        target="_blank" 
        rel="noreferrer"
        className="w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group"
      >
        <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />
      </a>
    </div>
  );
};

export default WhatsAppFAB;
