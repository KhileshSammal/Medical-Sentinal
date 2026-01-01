
import React from 'react';
import { Dna, Zap, TrendingUp, ShieldCheck, Heart, Coffee, Pill, Activity } from 'lucide-react';
import { HealthStatus } from '../types';

const Longevity: React.FC = () => {
  const genomicMarkers = [
    { trait: 'Caffeine Sensitivity', impact: 'NEGATIVE', desc: 'High metabolic clearance, but elevated oxidative stress response.', reco: 'Limit caffeine post-2PM to maintain telomere integrity.' },
    { trait: 'Vitamin D Receptor', impact: 'NEGATIVE', desc: 'Genetically lower VDR expression, risk of seasonal malabsorption.', reco: 'Requires 5,000 IU/daily minimum during winter months.' },
    { trait: 'Lipid Metabolism', impact: 'POSITIVE', desc: 'Optimal ApoE genotype. Lower inherent risk for baseline LDL accumulation.', reco: 'Stable baseline. Current Mediterranean protocol is optimal.' },
    { trait: 'Muscle Hypertrophy', impact: 'POSITIVE', desc: 'ACTN3 "Speed" variant detected. Fast-twitch response is high.', reco: 'Incorporate explosive HIIT 2x/week for longevity metabolic health.' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">DNA Blueprint</h2>
          <p className="text-sm text-neutral-500 mt-1">Genomic-first longevity protocol.</p>
        </div>
        <div className="glass px-6 py-2 rounded-2xl border-lime-500/20 bg-lime-500/5 flex items-center gap-3">
          <div className="text-right">
            <div className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Longevity Score</div>
            <div className="text-xl font-bold text-lime-400 tracking-tighter">94/100</div>
          </div>
          <TrendingUp className="w-5 h-5 text-lime-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* DNA Visualization */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass p-8 rounded-[2.5rem] border-white/10 flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
            <div className="w-24 h-24 rounded-full bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-6 indigo-glow">
              <Dna className="w-10 h-10 text-indigo-400 animate-[spin_8s_linear_infinite]" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-widest">Helix Sequence</h3>
            <p className="text-[10px] text-neutral-500 font-mono mt-1">Whole Genome Seq: 3.2B base pairs verified</p>
            
            <div className="w-full mt-8 space-y-4">
               <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-neutral-500">BIOLOGICAL AGE</span>
                    <span className="text-indigo-400">23.2 Years</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[23%] bg-indigo-500" />
                  </div>
               </div>
               <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-neutral-500">TELOMERE HEALTH</span>
                    <span className="text-lime-400">OPTIMAL</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[91%] bg-lime-500" />
                  </div>
               </div>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl border-white/10 bg-white/[0.01]">
             <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2">
               <Activity className="w-3.5 h-3.5" /> Bio-Dynamic Alerts
             </h4>
             <div className="space-y-4">
                <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex gap-3 items-start">
                   <Coffee className="w-4 h-4 text-red-400 mt-1 shrink-0" />
                   <div>
                     <p className="text-xs font-bold text-white">Genomic Flag: Caffeine</p>
                     <p className="text-[10px] text-neutral-500 leading-relaxed mt-0.5">Metabolic clearance restricted. Switch to Theanine-buffered intake after 11AM.</p>
                   </div>
                </div>
                <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex gap-3 items-start">
                   <Pill className="w-4 h-4 text-indigo-400 mt-1 shrink-0" />
                   <div>
                     <p className="text-xs font-bold text-white">Longevity Protocol: Metformin</p>
                     <p className="text-[10px] text-neutral-500 leading-relaxed mt-0.5">Current HbA1c (5.1) confirms autophagy cycle is stable. No dosage adjustment required.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Genomic Insights List */}
        <div className="lg:col-span-8 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {genomicMarkers.map((marker, i) => (
                <div key={i} className="glass p-8 rounded-[2.5rem] border-white/10 hover:border-white/20 transition-all group">
                   <div className="flex justify-between items-start mb-4">
                      <div className={`px-2.5 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                        marker.impact === 'POSITIVE' ? 'bg-lime-500/10 text-lime-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {marker.impact === 'POSITIVE' ? 'Protective Variant' : 'Risk Variant'}
                      </div>
                      <ShieldCheck className="w-5 h-5 text-neutral-700 group-hover:text-indigo-400 transition-colors" />
                   </div>
                   <h4 className="text-lg font-bold text-white tracking-tight mb-2">{marker.trait}</h4>
                   <p className="text-xs text-neutral-400 leading-relaxed mb-6">{marker.desc}</p>
                   <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                      <div className="text-[9px] font-bold text-neutral-500 uppercase mb-2 tracking-widest">Longevity Action</div>
                      <p className="text-xs text-white font-medium">{marker.reco}</p>
                   </div>
                </div>
              ))}
           </div>

           <div className="glass p-10 rounded-[2.5rem] border-indigo-500/20 bg-indigo-500/5 flex items-center gap-8">
              <div className="w-20 h-20 rounded-2xl bg-indigo-600/20 flex items-center justify-center shrink-0">
                 <Zap className="w-10 h-10 text-indigo-400" />
              </div>
              <div>
                 <h4 className="text-xl font-bold text-white">Longevity Coach: Activated</h4>
                 <p className="text-sm text-neutral-400 mt-2 leading-relaxed max-w-lg">
                   Sentinel AI is now processing your real-time biomarkers (Glucose, Sleep) against your Genomic Blueprint. 
                   Your daily protocol is now 100% personalized to your specific DNA sequence.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Longevity;
