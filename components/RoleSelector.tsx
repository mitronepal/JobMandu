
import React from 'react';
import { UserRole } from '../types';
import { User, Building2, Briefcase, ArrowRight } from 'lucide-react';

interface RoleSelectorProps {
  onSelectRole: (role: UserRole) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#fcfcfd] flex items-center justify-center px-4 py-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">How will you use Jobmandu?</h2>
          <p className="text-slate-500 text-lg font-medium">Choose your path and let's get you started.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <button
            onClick={() => onSelectRole('seeker')}
            className="group bg-white p-10 rounded-[3rem] border border-slate-200/60 shadow-sm hover:shadow-2xl hover:border-blue-600 transition-all text-left flex flex-col items-start"
          >
            <div className="bg-blue-600 text-white w-16 h-16 rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
              <User className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4">Job Seeker</h3>
            <p className="text-slate-500 mb-8 font-medium leading-relaxed">
              Find incredible remote and local roles, build your career profile, and apply with ease.
            </p>
            <div className="mt-auto flex items-center text-blue-600 font-black text-sm uppercase tracking-widest">
              Launch Career <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={16} />
            </div>
          </button>

          <button
            onClick={() => onSelectRole('provider')}
            className="group bg-white p-10 rounded-[3rem] border border-slate-200/60 shadow-sm hover:shadow-2xl hover:border-violet-600 transition-all text-left flex flex-col items-start"
          >
            <div className="bg-violet-600 text-white w-16 h-16 rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-violet-200 group-hover:scale-110 transition-transform">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4">Hiring Manager</h3>
            <p className="text-slate-500 mb-8 font-medium leading-relaxed">
              Post listings, manage applicants, and find the perfect talent for your company's growth.
            </p>
            <div className="mt-auto flex items-center text-violet-600 font-black text-sm uppercase tracking-widest">
              Find Talent <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={16} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
