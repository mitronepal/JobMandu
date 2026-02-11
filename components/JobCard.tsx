
import React, { useState } from 'react';
import { Listing } from '../types';
import { Briefcase, MapPin, Banknote, Clock, ArrowUpRight, MoreVertical, Flag, Eye, Lock, Unlock, Trash2, Home } from 'lucide-react';

interface JobCardProps {
  job: Listing;
  isProvider: boolean;
  isOwnJob: boolean;
  onToggleStatus: () => void;
  onDelete: () => void;
  onClick: () => void;
  onReport: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, isProvider, isOwnJob, onToggleStatus, onDelete, onClick, onReport }) => {
  const [showMenu, setShowMenu] = useState(false);
  const isOpen = job.status === 'Open' || job.status === 'Available';
  const isRoom = job.category === 'room';

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
    setShowMenu(false);
  };

  return (
    <div 
      className={`group bg-white rounded-[2rem] border border-slate-100 p-5 transition-all hover:shadow-xl hover:border-indigo-100 cursor-pointer flex flex-col relative overflow-hidden text-left ${!isOpen ? 'opacity-70 bg-slate-50/50' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isOpen ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white' : 'bg-slate-200 text-slate-500'}`}>
          {isRoom ? <Home size={18} /> : <Briefcase size={18} />}
        </div>
        
        <div className="flex items-center gap-1.5 relative">
           <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 text-slate-400 rounded-full text-[8px] font-black uppercase tracking-widest border border-slate-100">
             <Eye size={10} /> {job.views || 0}
           </div>

           <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all ${isOpen ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
             {isRoom ? (isOpen ? 'Available' : 'Rented') : (isOpen ? 'Active' : 'Closed')}
           </span>

           <div className="relative">
             <button 
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-300 hover:text-slate-900"
             >
               <MoreVertical size={16} />
             </button>
             {showMenu && (
               <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                  {isOwnJob ? (
                    <>
                      <button onClick={(e) => handleAction(e, onToggleStatus)} className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 transition-colors">
                        {isOpen ? <Lock size={12} /> : <Unlock size={12} />} 
                        {isOpen ? 'Close' : 'Reopen'}
                      </button>
                      <button onClick={(e) => handleAction(e, onDelete)} className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-[9px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors">
                        <Trash2 size={12} /> Delete
                      </button>
                    </>
                  ) : (
                    <button onClick={(e) => handleAction(e, onReport)} className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-[9px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors">
                      <Flag size={12} /> Report
                    </button>
                  )}
               </div>
             )}
           </div>
        </div>
      </div>

      <div className="flex-grow mb-4">
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-0.5 tracking-tight">{job.title}</h3>
        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mb-3">
           {isRoom ? (job.roomCount || 'Room Listing') : (job.companyName || 'Verified Employer')}
        </p>
        
        <div className="space-y-1.5">
           <div className="flex items-center text-slate-500 font-bold text-[10px] uppercase tracking-tight">
             <MapPin size={12} className="mr-2 text-indigo-400" />
             {job.location}
           </div>
           <div className="flex items-center text-slate-500 font-bold text-[10px] uppercase tracking-tight">
             <Banknote size={12} className="mr-2 text-green-400" />
             {isRoom ? `RS ${job.price?.toLocaleString()} /mo` : `RS ${job.minSalary?.toLocaleString()}`}
           </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-50 flex items-center justify-between mt-auto">
        <div className="flex items-center text-[8px] font-black uppercase tracking-widest text-slate-400">
           <Clock size={10} className="mr-1.5" />
           {job.timestamp ? new Date(job.timestamp.seconds * 1000).toLocaleDateString() : 'New'}
        </div>
        <div className="w-7 h-7 bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white rounded-full flex items-center justify-center transition-all">
           <ArrowUpRight size={12} />
        </div>
      </div>
    </div>
  );
};

export default JobCard;
