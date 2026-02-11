
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, Timestamp, doc, updateDoc, deleteDoc, increment, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile, Listing, ListingStatus, JobType, ListingCategory } from '../types';
import JobCard from './JobCard';
import { Plus, X, Phone, Search, Sparkles, Loader2, MapPin, Banknote, ShieldAlert, ShieldCheck, Gavel, ListChecks, LayoutGrid, Navigation, Map as MapIcon, Crosshair, Trash2, LocateFixed, Flag, Briefcase, Home, ArrowUpRight, Filter, DollarSign } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import L from 'leaflet';

interface DashboardProps {
  profile: UserProfile | null;
  onAuthRequired: () => void;
}

const NEPAL_LOCATIONS = ["Kathmandu", "Pokhara", "Lalitpur", "Bharatpur", "Biratnagar", "Birgunj", "Butwal", "Dharan", "Nepalgunj", "Remote (Nepal)"];
const JOB_TYPES: (JobType | 'All')[] = ['All', 'Full-time', 'Part-time', 'Contract', 'Freelance'];

const Dashboard: React.FC<DashboardProps> = ({ profile, onAuthRequired }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [activeTab, setActiveTab] = useState<ListingCategory>('job');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [showEthicsDialog, setShowEthicsDialog] = useState(false);
  const [showAILangSelector, setShowAILangSelector] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Listing | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'all' | 'mine'>('all');
  const [showSafetyDialog, setShowSafetyDialog] = useState(false);
  const [showContactConfirm, setShowContactConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // New Filter States
  const [minSalaryFilter, setMinSalaryFilter] = useState<string>('');
  const [maxSalaryFilter, setMaxSalaryFilter] = useState<string>('');
  const [jobTypeFilter, setJobTypeFilter] = useState<JobType | 'All'>('All');
  const [showFilters, setShowFilters] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [formData, setFormData] = useState({
    category: 'job' as ListingCategory,
    title: '',
    companyName: '',
    description: '',
    experienceLevel: '',
    skillsRequired: '',
    benefits: '',
    contactNumber: '',
    location: NEPAL_LOCATIONS[0],
    minSalary: 0,
    maxSalary: 0,
    type: 'Full-time' as JobType,
    roomCount: '',
    floorLevel: '',
    price: 0,
    latitude: 27.7172,
    longitude: 85.3240
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowSafetyDialog(true), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'jobs'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => {
        const data = doc.data();
        return { id: doc.id, category: data.category || 'job', ...data };
      }) as Listing[];
      setListings(list);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isMapModalOpen && mapContainerRef.current && !mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, { zoomControl: false }).setView([formData.latitude, formData.longitude], 13);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CartoDB'
      }).addTo(mapRef.current);
      markerRef.current = L.marker([formData.latitude, formData.longitude], { draggable: true }).addTo(mapRef.current);
      mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
        markerRef.current?.setLatLng(e.latlng);
      });
    }
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, [isMapModalOpen]);

  // रन्डम सर्टिङ (Randomized Feed with Enhanced Filters)
  const shuffledListings = useMemo(() => {
    let result = [...listings].sort(() => Math.random() - 0.5);
    
    return result.filter(item => {
      const matchesTab = item.category === activeTab;
      const searchTarget = `${item.title} ${item.location} ${item.companyName || ''}`.toLowerCase();
      const matchesSearch = searchTarget.includes(searchQuery.toLowerCase());
      const matchesView = viewMode === 'all' || (profile && item.providerId === profile.uid);
      
      // Salary & Job Type Filter Logic
      let matchesSalary = true;
      let matchesType = true;

      if (activeTab === 'job') {
        const minSal = parseInt(minSalaryFilter) || 0;
        const maxSal = parseInt(maxSalaryFilter) || 0;

        if (minSal > 0) matchesSalary = matchesSalary && (item.minSalary || 0) >= minSal;
        if (maxSal > 0) matchesSalary = matchesSalary && (item.minSalary || 0) <= maxSal;
        if (jobTypeFilter !== 'All') matchesType = item.type === jobTypeFilter;
      }

      return matchesTab && matchesSearch && matchesView && matchesSalary && matchesType;
    });
  }, [listings, searchQuery, viewMode, profile, activeTab, minSalaryFilter, maxSalaryFilter, jobTypeFilter]);

  const handlePickLocation = async () => {
    if (markerRef.current) {
      const { lat, lng } = markerRef.current.getLatLng();
      setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
      setIsLocating(true);
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        if (data.display_name) setFormData(prev => ({ ...prev, location: data.display_name }));
      } catch (error) { console.error(error); } finally {
        setIsLocating(false);
        setIsMapModalOpen(false);
      }
    }
  };

  const handleItemClick = async (item: Listing) => {
    if (!profile) {
      onAuthRequired();
      return;
    }
    setSelectedItem(item);
    setShowContactConfirm(false);
    
    if (!item.viewedBy || !item.viewedBy.includes(profile.uid)) {
      try {
        await updateDoc(doc(db, 'jobs', item.id), {
          views: increment(1),
          viewedBy: arrayUnion(profile.uid)
        });
      } catch (error) { console.error("Error updating views:", error); }
    }
  };

  const toggleStatus = async (id: string, currentStatus: ListingStatus, category: ListingCategory) => {
    try {
      let nextStatus: ListingStatus = category === 'job' 
        ? (currentStatus === 'Open' ? 'Closed' : 'Open')
        : (currentStatus === 'Available' ? 'Rented' : 'Available');
      await updateDoc(doc(db, 'jobs', id), { status: nextStatus });
    } catch (error) { console.error(error); }
  };

  const handleReport = async (item: Listing) => {
    if (!profile) { onAuthRequired(); return; }
    try {
      const reports = item.reports || [];
      if (reports.includes(profile.uid)) { alert("तपाईंले पहिले नै रिपोर्ट गरिसक्नुभएको छ।"); return; }
      const nextCount = (item.reportsCount || 0) + 1;
      if (nextCount >= 5) {
        await deleteDoc(doc(db, 'jobs', item.id));
        await updateDoc(doc(db, 'users', item.providerId), { isBlocked: true });
        setSelectedItem(null);
        alert("यो पोष्ट ५ पटक रिपोर्ट भएकोले हटाइएको छ र युजर ब्लक गरिएको छ।");
      } else {
        await updateDoc(doc(db, 'jobs', item.id), {
          reportsCount: increment(1),
          reports: arrayUnion(profile.uid)
        });
        alert("रिपोर्ट दर्ता भयो।");
      }
    } catch (error) { console.error(error); }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteDoc(doc(db, 'jobs', itemToDelete));
      setItemToDelete(null);
    } catch (error) { console.error(error); }
  };

  const finalSubmit = async () => {
    if (!profile) return;
    try {
      await addDoc(collection(db, 'jobs'), {
        ...formData,
        status: formData.category === 'job' ? 'Open' : 'Available',
        providerId: profile.uid,
        providerName: profile.displayName || 'Anonymous',
        timestamp: Timestamp.now(),
        reports: [], reportsCount: 0, views: 0, viewedBy: []
      });
      setIsModalOpen(false);
      setShowEthicsDialog(false);
      setFormData({
        category: activeTab, title: '', companyName: '', description: '',
        experienceLevel: '', skillsRequired: '', benefits: '', contactNumber: '',
        location: NEPAL_LOCATIONS[0], minSalary: 0, maxSalary: 0, type: 'Full-time' as JobType,
        roomCount: '', floorLevel: '', price: 0, latitude: 27.7172, longitude: 85.3240
      });
    } catch (error) { console.error(error); }
  };

  const handleAIGenerate = async (lang: 'en' | 'np') => {
    if (!formData.title) return;
    setIsGenerating(true);
    setShowAILangSelector(false);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = lang === 'np' 
        ? `तपाईं एक विशेषज्ञ कपीराइटर हो। शीर्षक: "${formData.title}" को आकर्षक विवरण लेख्नुहोस्।`
        : `Detailed professional job/room description for "${formData.title}".`;
      const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      if (response.text) setFormData(prev => ({ ...prev, description: response.text }));
    } catch (error) { console.error(error); } finally { setIsGenerating(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* विस्तृत सुरक्षा जानकारी */}
      {showSafetyDialog && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[200] flex items-center justify-center p-6 text-left text-slate-900">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-slate-100">
            <div className="bg-slate-900 p-8 text-white text-center">
               <ShieldAlert size={48} className="mx-auto mb-4 text-amber-400" />
               <h2 className="text-2xl font-black tracking-tight mb-1">सुरक्षा सम्बन्धी महत्वपूर्ण जानकारी</h2>
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest opacity-80">Safety First Policy</p>
            </div>
            <div className="p-8 space-y-8">
               <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100">
                     <h4 className="text-indigo-700 font-black text-xs uppercase mb-4 flex items-center gap-2"><Briefcase size={16} /> जागिर खोज्नेहरूका लागि</h4>
                     <ul className="space-y-3 text-xs font-bold text-slate-600 leading-relaxed">
                        <li>✅ जबमान्डु पूर्ण रूपमा निशुल्क छ।</li>
                        <li className="text-red-600">❌ कुनै पनि कम्पनीले 'Security Deposit' वा 'Uniform' को नाममा पैसा मागेमा त्यो ठगी हो।</li>
                        <li>❌ पैसा मागेमा तुरुन्तै पोष्ट रिपोर्ट गर्नुहोस्।</li>
                     </ul>
                  </div>
                  <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100">
                     <h4 className="text-amber-700 font-black text-xs uppercase mb-4 flex items-center gap-2"><Home size={16} /> कोठा खोज्नेहरूका लागि</h4>
                     <ul className="space-y-3 text-xs font-bold text-slate-600 leading-relaxed">
                        <li>✅ कोठा आफैंले हेरेर चित्त बुझेपछि मात्र बैना गर्नुहोस्।</li>
                        <li className="text-red-600">❌ कोठा नहेरी फेसबुक वा म्यासेजको भरमा कसैलाई पैसा नपठाउनुहोस्।</li>
                        <li>✅ म्यापमा लोकेसन पक्का गर्नुहोस्।</li>
                     </ul>
                  </div>
               </div>
               <button onClick={() => setShowSafetyDialog(false)} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-600 transition-all shadow-xl active:scale-95">म बुझ्दछु, अगाडि बढ्नुहोस्</button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative mb-10 p-10 bg-indigo-600 rounded-[2.5rem] overflow-hidden shadow-2xl text-left">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setActiveTab('job')} className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'job' ? 'bg-white text-indigo-600 shadow-md' : 'bg-white/10 text-white'}`}>Job Portal</button>
                <button onClick={() => setActiveTab('room')} className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'room' ? 'bg-white text-indigo-600 shadow-md' : 'bg-white/10 text-white'}`}>Room Portal</button>
             </div>
             <h2 className="text-4xl font-black text-white mb-2 tracking-tighter leading-tight">
               {activeTab === 'job' ? 'Verified Jobs in Nepal.' : 'Best Rooms in Your City.'}
             </h2>
             <p className="text-indigo-100 text-sm opacity-80 mb-6 flex items-center gap-2"><ShieldCheck size={18} className="text-green-400" /> Secure marketplace.</p>
             {profile && profile.role === 'provider' && (
               <div className="inline-flex bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/10">
                 <button onClick={() => setViewMode('all')} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'all' ? 'bg-white text-indigo-600 shadow-md' : 'text-white/70'}`}>Discover All</button>
                 <button onClick={() => setViewMode('mine')} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'mine' ? 'bg-white text-indigo-600 shadow-md' : 'text-white/70'}`}>My Posts</button>
               </div>
             )}
          </div>
      </div>

      {/* Search & New Filter Bar */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder={`Search verified ${activeTab}s...`} 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] focus:border-indigo-600 outline-none font-bold text-slate-700 shadow-sm transition-all text-sm" 
            />
          </div>
          {activeTab === 'job' && (
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all border-2 ${showFilters ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200' : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-100 hover:text-indigo-600'}`}
            >
              <Filter size={16} /> Filters
            </button>
          )}
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && activeTab === 'job' && (
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50 animate-in slide-in-from-top-4 duration-300">
             <div className="grid md:grid-cols-3 gap-10">
                {/* Job Type Filter */}
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><Briefcase size={14} /> Job Category</h4>
                   <div className="flex flex-wrap gap-2">
                      {JOB_TYPES.map((type) => (
                        <button
                          key={type}
                          onClick={() => setJobTypeFilter(type)}
                          className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${jobTypeFilter === type ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                        >
                          {type}
                        </button>
                      ))}
                   </div>
                </div>

                {/* Salary Filter */}
                <div className="md:col-span-2 space-y-4">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><DollarSign size={14} /> Salary Range (RS)</h4>
                   <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-full relative">
                        <input 
                          type="number" 
                          placeholder="Min Salary" 
                          value={minSalaryFilter}
                          onChange={(e) => setMinSalaryFilter(e.target.value)}
                          className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-xl outline-none font-bold text-sm"
                        />
                      </div>
                      <span className="text-slate-300 font-black">TO</span>
                      <div className="w-full relative">
                        <input 
                          type="number" 
                          placeholder="Max Salary" 
                          value={maxSalaryFilter}
                          onChange={(e) => setMaxSalaryFilter(e.target.value)}
                          className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-xl outline-none font-bold text-sm"
                        />
                      </div>
                      <button 
                        onClick={() => { setMinSalaryFilter(''); setMaxSalaryFilter(''); setJobTypeFilter('All'); }}
                        className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        Reset
                      </button>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Grid Display */}
      {loading ? (
        <div className="py-40 flex flex-col items-center justify-center space-y-4 text-slate-400">
          <Loader2 className="animate-spin" size={40} />
          <span className="font-black uppercase text-[9px] tracking-widest">Loading...</span>
        </div>
      ) : shuffledListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {shuffledListings.map((item) => (
            <JobCard key={item.id} job={item} isProvider={profile?.role === 'provider'} isOwnJob={profile ? item.providerId === profile.uid : false} onToggleStatus={() => toggleStatus(item.id, item.status, item.category)} onDelete={() => setItemToDelete(item.id)} onClick={() => handleItemClick(item)} onReport={() => handleReport(item)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-40 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100 flex flex-col items-center">
           <LayoutGrid className="text-slate-200 mb-6" size={56} />
           <h3 className="text-xl font-black text-slate-900">No results found</h3>
           <p className="text-slate-400 text-sm font-medium mt-2">Try adjusting your filters.</p>
        </div>
      )}

      {/* Posting Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[120] flex items-center justify-center p-4 text-left text-slate-900">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="flex bg-slate-100 p-0.5 rounded-xl">
                    <button onClick={() => setFormData({...formData, category: 'job'})} className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${formData.category === 'job' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}>Job</button>
                    <button onClick={() => setFormData({...formData, category: 'room'})} className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${formData.category === 'room' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}>Room</button>
                 </div>
                 <h3 className="text-xl font-black ml-2">Post New</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-slate-900"><X size={24} /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setShowEthicsDialog(true); }} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
               <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase text-slate-400 ml-3 tracking-widest">Title</label>
                    <input required placeholder={formData.category === 'job' ? "Graphic Designer" : "1 BHK Flat"} className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-xl outline-none font-bold text-sm" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                  </div>
                  {formData.category === 'job' ? (
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase text-slate-400 ml-3 tracking-widest">Company</label>
                      <input required placeholder="Verified Company Name" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-xl outline-none font-bold text-sm" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase text-slate-400 ml-3 tracking-widest">Price (RS)</label>
                      <input type="number" required placeholder="RS 0.00" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-xl outline-none font-bold text-sm" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })} />
                    </div>
                  )}
               </div>
               {formData.category === 'job' && (
                 <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase text-slate-400 ml-3 tracking-widest">Min Salary (RS)</label>
                      <input type="number" required placeholder="15000" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-xl outline-none font-bold text-sm" value={formData.minSalary} onChange={(e) => setFormData({ ...formData, minSalary: parseInt(e.target.value) || 0 })} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase text-slate-400 ml-3 tracking-widest">Max Salary (RS)</label>
                      <input type="number" required placeholder="45000" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-xl outline-none font-bold text-sm" value={formData.maxSalary} onChange={(e) => setFormData({ ...formData, maxSalary: parseInt(e.target.value) || 0 })} />
                    </div>
                 </div>
               )}
               <div className="grid md:grid-cols-2 gap-5">
                 <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase text-slate-400 ml-3 tracking-widest">Location</label>
                    <div className="relative group">
                      <input required placeholder="Pick on Map or Type Address..." className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-xl outline-none font-bold text-sm pr-24" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                      <button type="button" onClick={() => setIsMapModalOpen(true)} className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-indigo-600 text-white rounded-lg font-black text-[8px] uppercase tracking-widest flex items-center gap-1 shadow-md"><MapIcon size={12} /> MAP</button>
                    </div>
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-[8px] font-black uppercase text-slate-400 ml-3 tracking-widest">{formData.category === 'job' ? 'Job Type' : 'Floor/Config'}</label>
                   {formData.category === 'job' ? (
                     <select className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-xl outline-none font-bold text-sm" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as JobType })}><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Freelance</option></select>
                   ) : (
                     <input placeholder="e.g. 2nd Floor" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-xl outline-none font-bold text-sm" value={formData.roomCount} onChange={(e) => setFormData({ ...formData, roomCount: e.target.value })} />
                   )}
                 </div>
               </div>
               <div className="relative space-y-1.5">
                 <label className="text-[8px] font-black uppercase text-slate-400 ml-3 tracking-widest">Details</label>
                 <textarea required rows={5} placeholder="Full description, requirements..." className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-bold resize-none leading-relaxed text-sm" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                 <button type="button" onClick={() => setShowAILangSelector(true)} className="absolute bottom-3 right-3 text-indigo-600 font-black text-[9px] uppercase flex items-center bg-white px-3.5 py-1.5 rounded-full shadow-md border border-indigo-50 active:scale-95 transition-all"><Sparkles size={12} className="mr-1" /> AI ASSIST</button>
               </div>
               <div className="space-y-1.5">
                  <label className="text-[8px] font-black uppercase text-slate-400 ml-3 tracking-widest">Contact Number</label>
                  <input required placeholder="98XXXXXXXX" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-xl outline-none font-bold text-sm" value={formData.contactNumber} onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })} />
               </div>
               <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-600 transition-all shadow-xl active:scale-95">Post Now</button>
            </form>
          </div>
        </div>
      )}

      {/* Ethics Pact */}
      {showEthicsDialog && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[500] flex items-center justify-center p-6 text-left text-slate-900">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-300">
             <div className="bg-slate-900 p-8 text-white text-center">
                <Gavel size={56} className="mx-auto mb-4 opacity-80" />
                <h3 className="text-2xl font-black mb-1">Ethics Agreement</h3>
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest opacity-70">Anti-Scam Commitment</p>
             </div>
             <div className="p-8 space-y-6">
                <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 text-slate-800 font-bold leading-relaxed text-xs">
                   <p>म कुनै पनि युजरसँग काम वा कोठा पक्का हुनु अगाडि कुनै पनि बहानामा पैसा माग्ने छैन। यदि मैले त्यसो गरेको पाइएमा मेरो एकाउन्ट ब्लक गरिनेछ।</p>
                </div>
                <div className="flex gap-4">
                   <button onClick={() => setShowEthicsDialog(false)} className="flex-1 py-3 text-slate-400 font-black uppercase text-[9px]">रद्द</button>
                   <button onClick={finalSubmit} className="flex-[2] bg-indigo-600 text-white py-3 rounded-xl font-black uppercase text-[9px] shadow-xl active:scale-95">I Agree, Post Now</button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[400] flex items-center justify-center p-6 text-center text-slate-900">
           <div className="bg-white rounded-[2rem] p-10 w-full max-w-sm shadow-2xl animate-in zoom-in duration-300">
              <div className="w-14 h-14 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mx-auto mb-6"><Trash2 size={28} /></div>
              <h3 className="text-xl font-black text-slate-900 mb-2">डिलिट गर्ने?</h3>
              <p className="text-slate-500 text-xs mb-8">यो पोष्ट सधैंको लागि हटाइनेछ।</p>
              <div className="flex gap-4">
                 <button onClick={() => setItemToDelete(null)} className="flex-1 py-3.5 bg-slate-50 text-slate-400 rounded-xl font-black uppercase text-[10px]">रद्द</button>
                 <button onClick={confirmDelete} className="flex-1 py-3.5 bg-red-600 text-white rounded-xl font-black uppercase text-[10px] shadow-lg shadow-red-100">डिलिट</button>
              </div>
           </div>
        </div>
      )}

      {/* AI Language Picker */}
      {showAILangSelector && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[150] flex items-center justify-center p-6">
           <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl animate-in zoom-in duration-300">
              <h3 className="text-lg font-black mb-5">AI Helper</h3>
              <div className="flex flex-col gap-3">
                 <button onClick={() => handleAIGenerate('en')} className="flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-600 hover:text-white rounded-xl transition-all font-black uppercase text-[10px] tracking-widest">English Vacancy <ArrowUpRight size={16} /></button>
                 <button onClick={() => handleAIGenerate('np')} className="flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-600 hover:text-white rounded-xl transition-all font-black uppercase text-[10px] tracking-widest">नेपालीमा लेख्नुहोस् <ArrowUpRight size={16} /></button>
              </div>
              <button onClick={() => setShowAILangSelector(false)} className="w-full mt-5 py-3 text-slate-400 font-bold text-xs">Cancel</button>
           </div>
        </div>
      )}

      {/* Map Selection */}
      {isMapModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[300] flex items-center justify-center p-4">
           <div className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-300">
              <div className="p-5 border-b flex items-center justify-between"><h3 className="text-lg font-black">Location</h3><button onClick={() => setIsMapModalOpen(false)} className="p-2 bg-slate-100 rounded-full"><X size={16} /></button></div>
              <div className="relative h-[350px]"><div ref={mapContainerRef} className="h-full w-full"></div><button onClick={() => { if(navigator.geolocation) navigator.geolocation.getCurrentPosition(pos => { mapRef.current?.setView([pos.coords.latitude, pos.coords.longitude], 16); markerRef.current?.setLatLng([pos.coords.latitude, pos.coords.longitude]); }); }} className="absolute bottom-4 left-4 z-[1000] p-2 bg-white shadow-2xl rounded-lg text-indigo-600 border border-slate-100"><Crosshair size={20} /></button></div>
              <div className="p-5 bg-slate-50 flex gap-4 text-xs"><button onClick={() => setIsMapModalOpen(false)} className="flex-1 py-3 text-slate-400 font-black uppercase text-[10px]">रद्द</button><button onClick={handlePickLocation} className="flex-[2] bg-indigo-600 text-white py-3 rounded-lg font-black uppercase text-[10px] shadow-lg flex items-center justify-center gap-2 active:scale-95">{isLocating ? <Loader2 className="animate-spin" size={12} /> : <Navigation size={12} />} Confirm</button></div>
           </div>
        </div>
      )}

      {/* Details View (Protected) */}
      {selectedItem && profile && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[150] flex items-center justify-center p-4 text-left text-slate-900">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="bg-amber-400 text-slate-900 px-8 py-2.5 flex items-center justify-center gap-2.5 text-[8px] font-black uppercase tracking-widest"><ShieldAlert size={14} /><span>अग्रिम पैसा कतै नपठाउनुहोस्।</span></div>
            <div className="relative h-40 bg-gradient-to-br from-indigo-700 to-violet-700 flex items-end p-8 text-white"><button onClick={() => setSelectedItem(null)} className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/10 p-2 rounded-full transition-all"><X size={20} /></button><div><h3 className="text-2xl font-black leading-none mb-1.5">{selectedItem.title}</h3><p className="text-indigo-100 font-bold opacity-80 text-xs">{selectedItem.category === 'job' ? selectedItem.companyName : 'Verified Listing'}</p></div></div>
            <div className="p-8 overflow-y-auto max-h-[50vh] space-y-6">
              <div className="grid grid-cols-2 gap-4 text-xs font-bold"><div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3"><MapPin className="text-indigo-500" size={16} /> {selectedItem.location}</div><div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3"><Banknote className="text-green-500" size={16} /> {selectedItem.category === 'job' ? `RS ${selectedItem.minSalary?.toLocaleString()}` : `RS ${selectedItem.price?.toLocaleString()} /mo`}</div></div>
              <div className="space-y-3"><h4 className="text-[8px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><ListChecks size={12} /> Details</h4><div className="bg-slate-50 p-6 rounded-[1.5rem] text-slate-600 font-medium leading-relaxed whitespace-pre-wrap text-sm border border-slate-100">{selectedItem.description}</div></div>
              <div className="pt-6 border-t border-slate-50">{!showContactConfirm ? (<button onClick={() => setShowContactConfirm(true)} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-center text-sm shadow-xl flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all"><Phone size={18} /> Get Contact Details</button>) : (<div className="bg-indigo-50 p-6 rounded-[1.5rem] animate-in zoom-in duration-300 border border-indigo-100"><a href={`tel:${selectedItem.contactNumber}`} className="block w-full bg-indigo-600 text-white py-4 rounded-xl font-black text-center text-lg shadow-xl tracking-widest">Call: {selectedItem.contactNumber}</a></div>)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Provider FAB (Create Button) */}
      {profile?.role === 'provider' && (
        <button onClick={() => setIsModalOpen(true)} className="fixed bottom-10 left-10 h-16 px-10 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all z-40 border-4 border-white">
          <Plus size={24} className="mr-2" />
          <span className="font-black uppercase tracking-widest text-xs">Create Post</span>
        </button>
      )}
    </div>
  );
};

export default Dashboard;
