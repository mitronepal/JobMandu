
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Briefcase, LogOut, User as UserIcon, Shield, HelpCircle, FileText, X, ChevronRight, Mail, MessageSquare } from 'lucide-react';

interface NavbarProps {
  profile: UserProfile | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onLogoClick: () => void;
  onNavigate: (page: 'help' | 'privacy' | 'terms') => void;
}

const Navbar: React.FC<NavbarProps> = ({ profile, onLoginClick, onLogout, onLogoClick, onNavigate }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <nav className="glass sticky top-0 z-50 border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={onLogoClick}>
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
            <Briefcase className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 tracking-tighter text-left">
            Job<span className="text-indigo-600">mandu</span>
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <button onClick={onLogoClick} className="hover:text-indigo-600 transition-colors">Discover</button>
          <button onClick={() => onNavigate('help')} className="hover:text-indigo-600 transition-colors">Safety Center</button>
          <button onClick={() => onNavigate('terms')} className="hover:text-indigo-600 transition-colors">Usage Rules</button>
        </div>

        <div className="flex items-center space-x-4">
          {profile ? (
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 bg-white p-1.5 pr-5 rounded-full border border-slate-200 shadow-sm hover:border-indigo-300 transition-all active:scale-95"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                  {profile.photoURL ? (
                    <img src={profile.photoURL} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-4 h-4 text-indigo-600" />
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-black text-slate-900 leading-tight truncate max-w-[100px]">{profile.displayName}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{profile.role}</p>
                </div>
              </button>

              {/* Profile Pop-up Dialog */}
              {showProfileMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)}></div>
                  <div className="absolute right-0 mt-4 w-80 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-8 bg-indigo-600 text-white relative text-left">
                      <button onClick={() => setShowProfileMenu(false)} className="absolute top-4 right-4 text-white/50 hover:text-white"><X size={20} /></button>
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 text-white">
                        <UserIcon size={32} />
                      </div>
                      <h3 className="text-xl font-black tracking-tight leading-none">{profile.displayName}</h3>
                      <p className="text-indigo-100 text-xs font-bold mt-1 flex items-center gap-1 opacity-80 truncate">
                        <Mail size={12} /> {profile.email}
                      </p>
                    </div>

                    <div className="p-4 space-y-1">
                       <button onClick={() => { onNavigate('help'); setShowProfileMenu(false); }} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors"><Shield size={18} /></div>
                            <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Support</span>
                          </div>
                          <ChevronRight size={16} className="text-slate-300" />
                       </button>

                       <button onClick={() => { onNavigate('privacy'); setShowProfileMenu(false); }} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors"><FileText size={18} /></div>
                            <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Privacy Policy</span>
                          </div>
                          <ChevronRight size={16} className="text-slate-300" />
                       </button>

                       <button onClick={() => { onNavigate('terms'); setShowProfileMenu(false); }} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors"><HelpCircle size={18} /></div>
                            <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Terms of Service</span>
                          </div>
                          <ChevronRight size={16} className="text-slate-300" />
                       </button>

                       <a href="https://wa.me/9779861513184" target="_blank" rel="noreferrer" className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors"><MessageSquare size={18} /></div>
                            <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Contact Now</span>
                          </div>
                          <ChevronRight size={16} className="text-slate-300" />
                       </a>

                       <div className="pt-4 mt-4 border-t border-slate-100 px-4 pb-4">
                         <button 
                           onClick={() => { onLogout(); setShowProfileMenu(false); }}
                           className="w-full bg-red-50 text-red-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95"
                         >
                           <LogOut size={16} /> Sign Out
                         </button>
                       </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={onLoginClick}
                className="px-10 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl active:scale-95 border-b-4 border-slate-950 hover:border-indigo-800"
              >
                Join Now
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
