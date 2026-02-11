
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile, UserRole } from './types';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import RoleSelector from './components/RoleSelector';
import AuthForm from './components/AuthForm';
import HelpCenter from './components/HelpCenter';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import WhatsAppFAB from './components/WhatsAppFAB';
import { Loader2, ShieldAlert, LogOut, Music2, MessageSquare } from 'lucide-react';

type Page = 'home' | 'help' | 'privacy' | 'terms';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchProfile = async (uid: string) => {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setProfile(docSnap.data() as UserProfile);
    } else {
      setProfile(null);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setShowAuth(false);
    setCurrentPage('home');
  };

  const handleSetRole = async (role: UserRole) => {
    if (!user) return;
    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'User',
      photoURL: null,
      role: role,
      membership: false,
      isBlocked: false,
      totalReportsReceived: 0
    };
    await setDoc(doc(db, 'users', user.uid), newProfile);
    setProfile(newProfile);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (profile?.isBlocked) {
    const waMessage = encodeURIComponent(`Hello Admin, my Jobmandu account (${profile.email}) has been suspended. I would like to request a review for reactivation.`);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-6 text-center text-white">
        <div className="bg-white p-12 rounded-[4rem] shadow-2xl max-w-lg border-4 border-red-500 animate-in zoom-in duration-500 text-slate-900">
           <ShieldAlert size={80} className="text-red-600 mx-auto mb-8 animate-pulse" />
           <h1 className="text-4xl font-black mb-6 tracking-tighter">Account Suspended</h1>
           <p className="text-slate-600 font-medium text-lg leading-relaxed mb-10">
             तपाईंको एकाउन्ट धेरैपटक 'Fraud' वा 'Terms Violation' को लागि रिपोर्ट गरिएकोले **स्थायी रूपमा प्रतिबन्धित (Block)** गरिएको छ।
           </p>
           <div className="flex flex-col gap-4">
             <a 
               href={`https://wa.me/9779861513184?text=${waMessage}`}
               target="_blank"
               rel="noreferrer"
               className="flex items-center justify-center gap-3 w-full py-5 bg-[#25D366] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-green-200"
             >
               <MessageSquare size={20} /> Contact Admin Support
             </a>
             <button 
               onClick={handleLogout}
               className="flex items-center justify-center gap-3 w-full py-5 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
             >
               <LogOut size={20} /> Sign Out
             </button>
           </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (currentPage === 'help') return <HelpCenter onBack={() => setCurrentPage('home')} onNavigate={(p) => setCurrentPage(p)} />;
    if (currentPage === 'privacy') return <PrivacyPolicy onBack={() => setCurrentPage('home')} />;
    if (currentPage === 'terms') return <TermsOfService onBack={() => setCurrentPage('home')} />;

    if (user && !profile?.role) {
      return <RoleSelector onSelectRole={handleSetRole} />;
    }

    if (showAuth && !user) {
      return <AuthForm onCancel={() => setShowAuth(false)} />;
    }

    return <Dashboard profile={profile} onAuthRequired={() => setShowAuth(true)} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFF]">
      <Navbar 
        profile={profile} 
        onLoginClick={() => setShowAuth(true)} 
        onLogout={handleLogout}
        onLogoClick={() => setCurrentPage('home')}
        onNavigate={(page) => setCurrentPage(page)}
      />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <WhatsAppFAB />
      <footer className="bg-slate-900 text-slate-400 py-20 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <h3 className="text-3xl font-black text-white mb-6 cursor-pointer" onClick={() => setCurrentPage('home')}>
              Job<span className="text-indigo-500">mandu</span>
            </h3>
            <p className="max-w-sm font-medium leading-relaxed text-slate-400 mb-8 text-left">
              Nepal's safest job and room portal. Built with integrity, powered by trust.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <a 
                href="https://www.tiktok.com/@job.mandu?_r=1&_t=ZS-93piR5f4j3N" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white hover:bg-indigo-600 transition-all group shadow-lg"
              >
                <Music2 size={24} className="group-hover:scale-110 transition-transform" />
              </a>
              <span className="text-[11px] font-black uppercase tracking-widest opacity-60">Follow on TikTok</span>
            </div>
          </div>
          <div className="text-left">
             <h4 className="font-bold text-white mb-8 uppercase text-xs tracking-[0.3em]">Quick Links</h4>
             <ul className="space-y-4 text-sm font-semibold">
               <li onClick={() => setCurrentPage('privacy')} className="hover:text-indigo-400 cursor-pointer transition-colors">Privacy</li>
               <li onClick={() => setCurrentPage('terms')} className="hover:text-indigo-400 cursor-pointer transition-colors">Terms</li>
               <li onClick={() => setCurrentPage('help')} className="hover:text-indigo-400 cursor-pointer transition-colors">Safety Guide</li>
             </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
