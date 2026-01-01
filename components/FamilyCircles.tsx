
import React from 'react';
import { Users, Shield, HeartPulse, ChevronRight, Activity, AlertCircle, Plus, MapPin } from 'lucide-react';
import HealthAura from './HealthAura';
import { HealthStatus } from '../types';

const FamilyCircles: React.FC = () => {
  const family = [
    { name: 'Suman Sammal', relation: 'Mother', status: HealthStatus.OPTIMAL, age: 58, score: 84, lastUpdate: '14 mins ago' },
    { name: 'Rakesh Sammal', relation: 'Brother', status: HealthStatus.STABLE, age: 31, score: 79, lastUpdate: '2 hours ago' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Family Circles</h2>
          <p className="text-sm text-neutral-500 mt-1">Sovereign oversight of your immediate trust network.</p>
        </div>
        <button className="px-6 py-2.5 bg-white text-black rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all flex items-center gap-2">
           <Plus className="w-3 h-3" /> Invite Circle Member
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
           {family.map((member, i) => (
             <div key={i} className="glass rounded-[2.5rem] border-white/10 overflow-hidden group hover:border-white/20 transition-all cursor-pointer">
                <div className="p-8 flex flex-col md:flex-row gap-8 items-center">
                   <div className="w-32 h-32 shrink-0">
                      <HealthAura status={member.status} score={member.score} />
                   </div>
                   <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                         <div>
                            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">{member.relation}</div>
                            <h3 className="text-2xl font-bold text-white tracking-tight">{member.name}</h3>
                         </div>
                         <div className="text-right">
                            <div className="text-[10px] font-bold text-neutral-600 uppercase mb-1">Last Update</div>
                            <div className="text-xs font-medium text-neutral-400">{member.lastUpdate}</div>
                         </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                         <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                            <div className="text-[8px] font-bold text-neutral-500 uppercase mb-1 tracking-tighter">Heart Rate</div>
                            <div className="text-sm font-bold text-white">72 <span className="text-[9px] font-normal text-neutral-600 uppercase">bpm</span></div>
                         </div>
                         <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                            <div className="text-[8px] font-bold text-neutral-500 uppercase mb-1 tracking-tighter">Blood Sugar</div>
                            <div className="text-sm font-bold text-white">104 <span className="text-[9px] font-normal text-neutral-600 uppercase">mg/dL</span></div>
                         </div>
                         <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                            <div className="text-[8px] font-bold text-neutral-500 uppercase mb-1 tracking-tighter">Recovery</div>
                            <div className="text-sm font-bold text-lime-400">92%</div>
                         </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 text-[10px] font-bold text-neutral-500 uppercase">
                         <MapPin className="w-3 h-3" /> Location Secured: Sector 45, Gurgaon
                      </div>
                   </div>
                   <ChevronRight className="w-6 h-6 text-neutral-800 group-hover:text-white transition-all transform group-hover:translate-x-2" />
                </div>
             </div>
           ))}
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="glass p-8 rounded-[2.5rem] border-amber-500/20 bg-amber-500/5">
              <div className="flex items-center gap-3 mb-6">
                 <Shield className="w-5 h-5 text-amber-500" />
                 <h4 className="text-sm font-bold uppercase tracking-widest text-white">Safety Protocol</h4>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                 "Priority 1" alerts are enabled for your Mother's Circle. 
                 Any shift in cardiac parameters will trigger an immediate Quartermaster intervention.
              </p>
              <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
                 <div className="flex items-center gap-2 text-[10px] font-bold text-amber-500 mb-2">
                    <AlertCircle className="w-3.5 h-3.5" /> EMERGENY CONTACTS
                 </div>
                 <div className="text-xs text-white space-y-2">
                    <p className="flex justify-between"><span>Max Healthcare</span> <span className="text-neutral-500">Gurgaon</span></p>
                    <p className="flex justify-between"><span>Quartermaster Team</span> <span className="text-neutral-500">24/7 Live</span></p>
                 </div>
              </div>
           </div>

           <div className="glass p-8 rounded-[2.5rem] border-white/10 bg-white/[0.01]">
              <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4">Pending Requests</h4>
              <p className="text-[10px] text-neutral-500 leading-relaxed italic">No incoming trust requests.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyCircles;
